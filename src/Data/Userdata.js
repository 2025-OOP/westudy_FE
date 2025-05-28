const users = [
    {
        id: 'testuser',
        password: '1234',
        events: {
            '2025-05-28': [
                { text: '기깔나게 숨쉬기', checked: false },
                { text: '간지나게 잠자기', checked: true }
            ],
            '2025-05-29': [
                { text: '미안하다 사랑한다 시청', checked: false }
            ],
            '2025-05-30': [
                { text: '한화이글스 승리', checked: false },
                { text: '야구장 가기', checked: true }
            ]
        }
    },
    {
        id: 'admin',
        password: 'admin123',
        events: {
            '2025-05-28': [
                { text: '야구 보기', checked: false },
                { text: '객체 과제', checked: false }
            ],
            '2025-05-31': [
                { text: '한화이글스의 승리 기원', checked: false }
            ]
        }
    }
];

export default users;