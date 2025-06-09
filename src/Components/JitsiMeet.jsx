// src/Components/JitsiMeet.jsx
import React, { useEffect, useRef, useState } from 'react';

const JitsiMeet = ({
  roomId,
  roomName,
  currentUser = '사용자',
  isPrivate = false,
  onMeetingEnd,
  onParticipantJoined,
  onParticipantLeft,
  width = '100%',
  height = '100%',
}) => {
  const jitsiContainerRef = useRef(null);
  const apiRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const initializingRef = useRef(false);
  const mountedRef = useRef(true);

  // 방 퇴장 처리 함수
  const leaveRoom = async () => {
    try {
      await fetch(`http://localhost:8080/api/rooms/${roomId}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser }),
      });
    } catch (err) {
      console.error('방 퇴장 실패:', err);
    }
  };

  // 백업 서버들과 함께 초기화 시도
  const initializeWithFallback = async () => {
    if (initializingRef.current || !mountedRef.current) return;
    initializingRef.current = true;

    // 여러 서버 순차 시도 (더 많은 옵션)
    const servers = [
      { domain: 'jitsi.riot.im', script: 'https://jitsi.riot.im/external_api.js' },
      { domain: 'meet.element.io', script: 'https://meet.element.io/external_api.js' },
      { domain: '8x8.vc', script: 'https://8x8.vc/external_api.js' },
      { domain: 'meet.jitsi.si', script: 'https://meet.jitsi.si/external_api.js' },
      { domain: 'jitsi.radiopaedia.org', script: 'https://jitsi.radiopaedia.org/external_api.js' }
    ];

    for (let serverIndex = 0; serverIndex < servers.length; serverIndex++) {
      if (!mountedRef.current) break;
      
      const server = servers[serverIndex];
      console.log(`🔄 ${server.domain} 시도 중... (${serverIndex + 1}/${servers.length})`);

      try {
        // 백엔드 방 입장 요청
        const resp = await fetch(`http://localhost:8080/api/rooms/${roomId}/enter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: currentUser }),
        });
        const data = await resp.json();
        if (!data.success) {
          throw new Error(data.message || '방 입장 실패');
        }

        // Jitsi 스크립트 로드
        await loadJitsiScript(server.script);
        if (!mountedRef.current) break;

        // Jitsi API 초기화
        const api = await createJitsiAPI(server.domain);
        if (!mountedRef.current) {
          api?.dispose();
          break;
        }

        // 성공적으로 연결됨
        apiRef.current = api;
        console.log(`✅ ${server.domain} 연결 성공!`);
        
        // 이벤트 리스너 설정
        setupEventListeners(api);
        return; // 성공하면 종료

      } catch (error) {
        console.log(`❌ ${server.domain} 실패:`, error.message);
        
        // API 정리
        if (apiRef.current) {
          try {
            apiRef.current.dispose();
          } catch (e) {}
          apiRef.current = null;
        }

        // 마지막 서버도 실패하면 iframe fallback 시도
        if (serverIndex === servers.length - 1) {
          console.log('모든 서버 실패, iframe fallback 시도...');
          try {
            createIframeFallback();
          } catch (fallbackError) {
            if (mountedRef.current) {
              setError('모든 화상회의 서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
              setIsLoading(false);
            }
          }
        }
      }
    }

    initializingRef.current = false;
  };

  // iframe fallback 함수 (모든 서버 실패 시)
  const createIframeFallback = () => {
    if (!jitsiContainerRef.current || !mountedRef.current) return;
    
    const roomName = `StudyRoom-${roomId}-${Date.now()}`;
    const params = new URLSearchParams({
      'config.prejoinPageEnabled': 'false',
      'config.enableWelcomePage': 'false',
      'config.enableLobby': 'false',
      'config.lobbyEnabled': 'false',
      'config.requireDisplayName': 'false',
      'config.enableUserRolesBasedOnToken': 'false',
      'config.enableJoinBeforeHost': 'true',
      'config.disableModeratorIndicator': 'true',
      'userInfo.displayName': currentUser
    });
    
    const iframeUrl = `https://meet.jit.si/${roomName}#${params.toString()}`;
    
    const iframe = document.createElement('iframe');
    iframe.src = iframeUrl;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = 'none';
    iframe.allow = 'camera; microphone; fullscreen; display-capture';
    
    jitsiContainerRef.current.innerHTML = '';
    jitsiContainerRef.current.appendChild(iframe);
    
    // iframe 로드 완료 시 로딩 해제
    iframe.onload = () => {
      if (mountedRef.current) {
        setIsLoading(false);
        console.log('✅ iframe fallback 연결 성공');
      }
    };
    
    console.log('📱 iframe fallback 사용:', iframeUrl);
  };

  // 스크립트 로드 함수
  const loadJitsiScript = (scriptUrl) => {
    return new Promise((resolve, reject) => {
      // 기존 스크립트 정리
      const existingScript = document.querySelector('script[src*="external_api.js"]');
      if (existingScript) {
        existingScript.remove();
        delete window.JitsiMeetExternalAPI;
      }

      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error('스크립트 로드 실패'));
      document.body.appendChild(script);
    });
  };

  // Jitsi API 생성 (강화된 설정)
  const createJitsiAPI = (domain) => {
    return new Promise((resolve, reject) => {
      if (!jitsiContainerRef.current || !window.JitsiMeetExternalAPI) {
        reject(new Error('API 또는 컨테이너 없음'));
        return;
      }

      // 시간 기반 고유한 방 이름 생성 (호스트 권한 우회)
      const uniqueRoomName = `public-${roomId}-${Date.now()}`;

      const options = {
        roomName: uniqueRoomName, // 고유한 방 이름
        width,
        height,
        parentNode: jitsiContainerRef.current,
        userInfo: { displayName: currentUser },

        configOverwrite: {
          // 핵심: 호스트 대기 완전 우회
          enableJoinBeforeHost: true,
          enableUserRolesBasedOnToken: false,
          enableLobby: false,
          lobbyEnabled: false,
          enableLobbyChat: false,
          lobbyPasswordEnabled: false,
          
          // 사전 입장 완전 비활성화
          prejoinPageEnabled: false,
          enableWelcomePage: false,
          enableClosePage: false,
          
          // 권한 관련 모든 설정 비활성화
          requireDisplayName: false,
          enableInsecureRoomNameWarning: false,
          enableEmailInStats: false,
          enableAutomaticUrlCopy: false,
          disableModeratorIndicator: true,
          enableModeratorOnlyMessage: false,
          enableGuestDomain: false,
          
          // 미디어 설정
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          
          // 기타 설정
          disableDeepLinking: true,
          startAudioOnly: false,
          enableNoAudioDetection: false,
          enableNoisyMicDetection: false,
          
          // JWT 토큰 관련 완전 비활성화
          enableFeatures: [],
          enableFeaturesBasedOnToken: false,
          
          // 추가 보안 우회 설정
          enableLiveStreamingForAllUsers: false,
          enableRecordingForAllUsers: false,
          hideConferenceSubject: true,
          hideConferenceTimer: false,
          hideParticipantsStats: true,
        },

        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_POWERED_BY: false,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          HIDE_DEEP_LINKING_LOGO: true,
          HIDE_INVITE_MORE_HEADER: true,
          DISABLE_PRESENCE_STATUS: true,
          
          // 툴바 단순화
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'hangup', 'tileview'
          ],
          
          // 설정 메뉴 숨기기
          SETTINGS_SECTIONS: [],
          
          // 추가 UI 숨기기
          GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
          DISPLAY_WELCOME_PAGE_CONTENT: false,
          DISABLE_VIDEO_BACKGROUND: true,
          HIDE_LOGO: true,
        },
      };

      try {
        const api = new window.JitsiMeetExternalAPI(domain, options);
        
        // 3초 내에 연결되지 않으면 실패 처리 (시간 단축)
        const timeout = setTimeout(() => {
          api.dispose();
          reject(new Error('연결 시간 초과'));
        }, 3000);

        // 연결 성공 이벤트
        api.addEventListener('videoConferenceJoined', () => {
          clearTimeout(timeout);
          resolve(api);
        });

        // 연결 실패 이벤트
        api.addEventListener('connectionFailed', () => {
          clearTimeout(timeout);
          api.dispose();
          reject(new Error('연결 실패'));
        });

      } catch (error) {
        reject(error);
      }
    });
  };

  // 이벤트 리스너 설정
  const setupEventListeners = (api) => {
    // 회의 입장 완료
    api.addEventListener('videoConferenceJoined', () => {
      if (mountedRef.current) {
        console.log('🟢 Jitsi 회의 입장 완료');
        setIsLoading(false);
      }
    });

    // 회의 퇴장
    api.addEventListener('videoConferenceLeft', async () => {
      console.log('🔴 Jitsi 회의에서 나감');
      await leaveRoom();
      if (onMeetingEnd) onMeetingEnd();
    });

    // 참가자 입장
    api.addEventListener('participantJoined', (participant) => {
      console.log('참가자 입장:', participant);
      if (onParticipantJoined) onParticipantJoined(participant);
    });

    // 참가자 퇴장
    api.addEventListener('participantLeft', (participant) => {
      console.log('참가자 퇴장:', participant);
      if (onParticipantLeft) onParticipantLeft(participant);
    });

    // 연결 실패
    api.addEventListener('connectionFailed', () => {
      console.error('Jitsi 연결 실패');
      if (mountedRef.current) {
        setError('연결에 실패했습니다. 네트워크를 확인해주세요.');
        setIsLoading(false);
      }
    });
  };

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    mountedRef.current = true;
    console.log(`JitsiMeet 초기화 시작: ${roomId} - ${roomName}`);
    
    initializeWithFallback();

    // 정리 함수
    return () => {
      mountedRef.current = false;
      initializingRef.current = false;
      
      if (apiRef.current) {
        try {
          apiRef.current.dispose();
        } catch (e) {
          console.error('API dispose 오류:', e);
        }
        apiRef.current = null;
      }
      
      if (jitsiContainerRef.current) {
        jitsiContainerRef.current.innerHTML = '';
      }
      
      leaveRoom();
    };
  }, []); // 의존성 배열을 빈 배열로 변경하여 재렌더링 방지

  // 에러 상태
  if (error) {
    return (
      <div style={{
        width, height, display: 'flex', justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#f5f5f5', flexDirection: 'column', padding: '20px',
      }}>
        <div style={{
          color: '#d32f2f', fontSize: '16px', marginBottom: '20px', textAlign: 'center',
        }}>
          {error}
        </div>
        <button
          onClick={() => {
            setError(null);
            setIsLoading(true);
            initializingRef.current = false;
            initializeWithFallback();
          }}
          style={{
            padding: '12px 24px', backgroundColor: '#034C8C', color: 'white',
            border: 'none', borderRadius: '6px', cursor: 'pointer',
            fontSize: '14px', fontWeight: '500', marginRight: '10px',
          }}
        >
          다시 시도
        </button>
        <button
          onClick={() => {
            setError(null);
            setIsLoading(true);
            createIframeFallback();
          }}
          style={{
            padding: '12px 24px', backgroundColor: '#6c757d', color: 'white',
            border: 'none', borderRadius: '6px', cursor: 'pointer',
            fontSize: '14px', fontWeight: '500',
          }}
        >
          간단 모드
        </button>
      </div>
    );
  }

  // 정상 렌더링
  return (
    <div style={{ width, height, position: 'relative' }}>
      {/* Jitsi 컨테이너 */}
      <div ref={jitsiContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* 로딩 오버레이 */}
      {isLoading && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          backgroundColor: 'rgba(245, 245, 245, 0.95)', flexDirection: 'column', zIndex: 10,
        }}>
          <div style={{
            width: '40px', height: '40px', border: '4px solid #f3f3f3',
            borderTop: '4px solid #034C8C', borderRadius: '50%',
            animation: 'spin 1s linear infinite', marginBottom: '12px',
          }} />
          <div style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
            여러 서버를 시도하여 연결 중...<br/>
            <span style={{ fontSize: '12px', color: '#999' }}>
              호스트 대기 없이 바로 입장합니다
            </span>
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default JitsiMeet;