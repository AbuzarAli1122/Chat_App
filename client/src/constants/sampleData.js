

export const sampleChats = [
    {
    avatar:['https://www.w3schools.com/howto/img_avatar.png'],
    name:'abuzar',
    _id:'1',
    groupChat:false,
    members:['1','2']
},
{
    avatar:[ 'https://www.w3schools.com/howto/img_avatar.png'],
    name:'ali',
    _id:'2',
    groupChat:false,
    members:['1','2']
},

]

export const sampleUsers = [
    {
    avatar:['https://www.w3schools.com/howto/img_avatar.png'],
    name:'abuzar',
    _id:'1',
    },
    {
    avatar:['https://www.w3schools.com/howto/img_avatar.png'],
    name:'zale',
    _id:'2',
    },
    
]


export const sampleNotifications = [
    {
    sender:{
    avatar:['https://www.w3schools.com/howto/img_avatar.png'],
    name:'abuzar',
    },
    _id:'1',
    },
    {
    sender:{
    avatar:['https://www.w3schools.com/howto/img_avatar.png'],
    name:'zale',
    },
    _id:'2',
    },
]

export const sampleMessage = [
    {
        attachments:[],
        content:'ayyy pagal insan',
        _id:'sasdasdasdnoc',
        sender:{
            _id:'user._id',
            name:'abuzar',
        },
        chat:'chatId',
        groupChat: false,
        createdAt: '2024-02-12T10:41:30.630Z'
    },
    {
        attachments:[
            {
                public_id:'11223',
                url : 'https://www.w3schools.com/howto/img_avatar.png'
            }
        ],
        content:'chaman hooo',
        _id:'sasdasdasdnoc2',
        sender:{
            _id:'asdadas',
            name:'zale',
        },
        chat:'chatId',
        createdAt: '2024-02-12T10:41:30.630Z'
    },
]

export const dashboardData = {
    users: [
        {
            name:'Aylx',
            avatar:'https://www.w3schools.com/howto/img_avatar.png',
            _id:'1',
            username:'blackDeath',
            friends:20,
            groups:5
        },
        {
            name:'Saad Abid',
            avatar:'https://www.w3schools.com/howto/img_avatar.png',
            _id:'2',
            username:'DjGandoya',
            friends:30,
            groups:10

        },
        {
            name:'Zale',
            avatar:'https://www.w3schools.com/howto/img_avatar.png',
            _id:'3',
            username:'BonaTripati',
            friends:40,
            groups:15
        },
        {
            name:'Osama',
            avatar:'https://www.w3schools.com/howto/img_avatar.png',
            _id:'4',
            username:'Thanos',
            friends:50,
            groups:20
        },
        {
            name:'Muzammil',
            avatar:'https://www.w3schools.com/howto/img_avatar.png',
            _id:'5',
            username:'PagalPathan',
            friends:60,
            groups:25
        },
        {
            name:'Romeo',
            avatar:'https://www.w3schools.com/howto/img_avatar.png',
            _id:'6',
            username:'BarayMouWala',
            friends:70,
            groups:30
        },
    ],
    chats:[
        {
            name:'Romeo',
            avatar:['https://www.w3schools.com/howto/img_avatar.png'],
            _id:'1',
            groupChat:false,
            members:[{_id:'1',avatar:'https://www.w3schools.com/howto/img_avatar.png'},{_id:'2', avatar:'https://www.w3schools.com/howto/img_avatar.png'}],
            totalMembers: 2,
            totalMessages:20,
            creator:{
                name:'Romeo',
                avatar:'https://www.w3schools.com/howto/img_avatar.png',
            } 
        },
        {
            name:'Zale',
            avatar:['https://www.w3schools.com/howto/img_avatar.png'],
            _id:'1',
            groupChat:false,
            members:[{_id:'3',avatar:'https://www.w3schools.com/howto/img_avatar.png'},{_id:'4', avatar:'https://www.w3schools.com/howto/img_avatar.png'}],
            totalMembers: 2,
            totalMessages:20,
            creator:{
                name:'Zale',
                avatar:'https://www.w3schools.com/howto/img_avatar.png',
            } 
        },
    ],

    messages:[
        {
            attachments:[],
            content:'bona jee',
            _id:'asasasadss',
            sender:{
                avatar:'https://www.w3schools.com/howto/img_avatar.png',
                name:'Arslan'
            },
            chat:'chatId',
            groupChat:false,
            createdAt: '2024-02-12T10:41:30.630Z',
        },
         {
            attachments:[{
                public_id:'awerq',
                url:'https://www.w3schools.com/howto/img_avatar.png',
            }],
            content:'pagal insan',
            _id:'qweryu',
            sender:{
                avatar:'https://www.w3schools.com/howto/img_avatar.png',
                name:'Chaman'
            },
            chat:'chatId',
            groupChat:true,
            createdAt: '2024-02-12T10:41:30.630Z',
        },
    ]
}