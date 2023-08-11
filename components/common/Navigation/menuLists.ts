export interface I_menuDepthsSet {
  menuName: string
  menuCode: string
  isOpen?: boolean
  list?: I_menuDepthsSet[]
  link: string
}

export interface I_menuNameSet {
  link: 'TotalDashBoard' | 'Epic' | 'Steam' | 'AdminManagement'
}

export interface I_tabMenuSet extends I_menuNameSet {
  menuName: string
  menuCode: string
}

export interface I_detailMenuSet {
  TotalDashBoard: I_menuDepthsSet[]
  Epic: I_menuDepthsSet[]
  Steam: I_menuDepthsSet[]
  AdminManagement: I_menuDepthsSet[]
}

export const headerMenuLists: I_tabMenuSet[] = [
  {
    menuCode: 'ELMU4',
    menuName: '통합 대시보드',
    link: 'TotalDashBoard',
  },
  {
    menuCode: 'ELMU2',
    menuName: 'Epic',
    link: 'Epic',
  },
  {
    menuCode: 'ELMU3',
    menuName: 'Steam',
    link: 'Steam',
  },
  {
    menuCode: 'ELMU1',
    menuName: '통합 관리자관리',
    link: 'AdminManagement',
  },
]

export const detailMenuLists: I_detailMenuSet = {
  TotalDashBoard: [],
  Epic: [
    {
      menuCode: 'ELMU5',
      menuName: '대시보드',
      link: 'DashBoard',
    },
    {
      menuCode: 'ELMU6',
      menuName: '회원관리',
      link: 'Account',
      list: [
        {
          menuCode: 'ELMU23',
          menuName: '일반계정',
          link: 'Normally',
        },
        {
          menuCode: 'ELMU24',
          menuName: '회사계정',
          link: 'Company',
        },
        {
          menuCode: 'ELMU25',
          menuName: '정지/탈퇴회원',
          link: 'Restrain',
        },
      ],
    },
    {
      menuCode: 'ELMU7',
      menuName: '매출 관리',
      link: 'Sales',
    },
    {
      menuCode: 'ELMU8',
      menuName: '아이템 관리',
      link: 'Item',
    },
    {
      menuCode: 'ELMU9',
      menuName: '통계',
      link: 'Statistics',
      list: [
        {
          menuCode: 'ELMU17',
          menuName: '회원 통계',
          link: 'User',
        },
        {
          menuCode: 'ELMU18',
          menuName: '접속 통계',
          link: 'Access',
        },
        {
          menuCode: 'ELMU19',
          menuName: '매출 통계',
          link: 'Sales',
        },
      ],
    },
    {
      menuCode: 'ELMU10',
      menuName: '이벤트 관리',
      link: 'Event',
    },
    {
      menuCode: 'ELMU11',
      menuName: '팝업&배너 관리',
      link: 'Popup&Benner',
    },
    {
      menuCode: 'ELMU12',
      menuName: '커뮤니티 관리',
      link: 'Community',
    },
  ],
  Steam: [
    {
      menuCode: 'ELMU14',
      menuName: '대시보드',
      link: 'DashBoard',
    },
    {
      menuCode: 'ELMU15',
      menuName: '회원관리',
      link: 'Account',
    },
  ],
  AdminManagement: [
    {
      menuCode: 'ELMU20',
      menuName: '관리자 관리',
      link: 'Account',
      list: [
        {
          menuCode: 'ELMU21',
          menuName: '관리자 목록',
          link: 'List',
        },
        {
          menuCode: 'ELMU22',
          menuName: '중지/삭제 관리자',
          link: 'InActive',
        },
      ],
    },
    {
      menuCode: 'ELMU16',
      menuName: '다수 권한 설정',
      link: 'MultiAuthorized',
    },
    {
      menuCode: 'ELMU13',
      menuName: '관리자 로그',
      link: 'logs',
    },
  ],
}

// const menuLists: I_menuDepthsSet[] = [
//   {
//     menuCode: 'ELMU001',
//     menuName: '회원관리',
//     link: 'Account',
//   },
//   {
//     menuCode: 'ELMU002',
//     menuName: '마켓 관리',
//     link: 'Market',
//   },
//   {
//     menuCode: 'ELMU003',
//     menuName: '아이템 관리',
//     link: 'Item',
//   },
//   {
//     menuCode: 'ELMU004',
//     menuName: '매출 관리',
//     link: 'Sales',
//   },
//   {
//     menuCode: 'ELMU005',
//     menuName: '이벤트 관리',
//     link: 'Event',
//   },
//   {
//     menuCode: 'ELMU006',
//     menuName: '팝업&배너 관리',
//     link: 'Popup&Benner',
//   },
//   {
//     menuCode: 'ELMU007',
//     menuName: '통계',
//     link: 'Statistics',
//   },
//   {
//     menuCode: 'ELMU008',
//     menuName: '커뮤니티 관리',
//     link: 'Community',
//   },
//   {
//     menuCode: 'ELMU009',
//     menuName: '재화 관리',
//     link: 'Goods',
//   },
//   {
//     menuCode: 'ELMU999',
//     menuName: '관리자 관리',
//     link: 'AdminManagement',
//   },
// ]

// export default menuLists
