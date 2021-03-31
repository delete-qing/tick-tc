import region from './region.js'

const state = {
    //分类 抽屉 显示与否
    classVisible: false,
    //分类 抽屉 选择或取消的回调 每次弹出需要 执行SET_CLASSCALLBACK重新赋值
    classCallback: function(){},

    // 详情
    detailvisible:false,
    // 编辑
    visibleEdit: false,
    // 快速制单
    visibleTouchingDetail: false,
    // 响应详情弹窗
    visibleRespondDetail: false,
    // 响应数据
    respondData: {},
    // 分配工单
    visibleMovey: false,
    // 信息详情
    visiblePartic: false,
    // 工单数据
    workOrderData: [
        {
           id: '1',
           customerName: '罗先生',
           customerAddress: '河南省郑州市金水区文劳路中海锦苑12号楼1单元507室',
           customerTel: '13150912686',
           workOrder: 'B2018111200158',
           identification: '1',
           expectDate: '2018/11/13',
           userRemark: '用户备注',
           venderName: '无极限',
           venderOrder: '1234567890',
           productNameplate: '净水器',
           productModel: 'L-W309',
           writeDate: '2018/11/12/ 15:35:25',
           workOrderState: '已响应 待下派',
           contacts: [
               {
                    customerName: '罗先生',
                    customerAddress: '河南省郑州市金水区文劳路中海锦苑12号楼1单元507室',
                    customerTel: '13150912686',
               },
               {
                customerName: '罗先生',
                customerAddress: '河南省郑州市金水区文劳路中海锦苑12号楼1单元507室',
                customerTel: '13150912686',
           },
           ]
        },
        {
            id: '2',
            customerName: '罗先生',
            customerAddress: '河南省郑州市金水区文劳路中海锦苑12号楼1单元507室',
            customerTel: '13150912686',
            workOrder: 'B2018111200158',
            identification: '1',
            expectDate: '2018/11/13',
            userRemark: '用户备注',
            venderName: '无极限',
            venderOrder: '1234567890',
            productNameplate: '净水器',
            productModel: 'L-W309',
            writeDate: '2018/11/12/ 15:35:25',
            workOrderState: '已响应 待下派',
            contacts: []
        },
        {
            id: '3',
            customerName: '罗先生',
            customerAddress: '河南省郑州市金水区文劳路中海锦苑12号楼1单元507室',
            customerTel: '13150912686',
            workOrder: 'B2018111200158',
            identification: '1',
            expectDate: '2018/11/13',
            userRemark: '用户备注',
            venderName: '无极限',
            venderOrder: '1234567890',
            productNameplate: '净水器',
            productModel: 'L-W309',
            writeDate: '2018/11/12/ 15:35:25',
            workOrderState: '已响应 待下派',
            contacts: []
        },
        {
            id: '4',
            customerName: '罗先生',
            customerAddress: '河南省郑州市金水区文劳路中海锦苑12号楼1单元507室',
            customerTel: '13150912686',
            workOrder: 'B2018111200158',
            identification: '1',
            expectDate: '2018/11/13',
            userRemark: '用户备注',
            venderName: '无极限',
            venderOrder: '1234567890',
            productNameplate: '净水器',
            productModel: 'L-W309',
            writeDate: '2018/11/12/ 15:35:25',
            workOrderState: '已响应 待下派',
            contacts: []
        },
        {
            id: '5',
            customerName: '罗先生',
            customerAddress: '河南省郑州市金水区文劳路中海锦苑12号楼1单元507室',
            customerTel: '13150912686',
            workOrder: 'B2018111200158',
            identification: '1',
            expectDate: '2018/11/13',
            userRemark: '用户备注',
            venderName: '无极限',
            venderOrder: '1234567890',
            productNameplate: '净水器',
            productModel: 'L-W309',
            writeDate: '2018/11/12/ 15:35:25',
            workOrderState: '已响应 待下派',
            contacts: []
        },
        {
            id: '6',
            customerName: '罗先生',
            customerAddress: '河南省郑州市金水区文劳路中海锦苑12号楼1单元507室',
            customerTel: '13150912686',
            workOrder: 'B2018111200158',
            identification: '1',
            expectDate: '2018/11/13',
            userRemark: '用户备注',
            venderName: '无极限',
            venderOrder: '1234567890',
            productNameplate: '净水器',
            productModel: 'L-W309',
            writeDate: '2018/11/12/ 15:35:25',
            workOrderState: '已响应 待下派',
            contacts: []
        },
        {
            id: '7',
            customerName: '罗先生',
            customerAddress: '河南省郑州市金水区文劳路中海锦苑12号楼1单元507室',
            customerTel: '13150912686',
            workOrder: 'B2018111200158',
            identification: '1',
            expectDate: '2018/11/13',
            userRemark: '用户备注',
            venderName: '无极限',
            venderOrder: '1234567890',
            productNameplate: '净水器',
            productModel: 'L-W309',
            writeDate: '2018/11/12/ 15:35:25',
            workOrderState: '已响应 待下派',
            contacts: []
        },
        {
            id: '8',
            customerName: '罗先生',
            customerAddress: '河南省郑州市金水区文劳路中海锦苑12号楼1单元507室',
            customerTel: '13150912686',
            workOrder: 'B2018111200158',
            identification: '1',
            expectDate: '2018/11/13',
            userRemark: '用户备注',
            venderName: '无极限',
            venderOrder: '1234567890',
            productNameplate: '净水器',
            productModel: 'L-W309',
            writeDate: '2018/11/12/ 15:35:25',
            workOrderState: '已响应 待下派',
            contacts: []
        },
        {
            id: '9',
            customerName: '罗先生',
            customerAddress: '河南省郑州市金水区文劳路中海锦苑12号楼1单元507室',
            customerTel: '13150912686',
            workOrder: 'B2018111200158',
            identification: '1',
            expectDate: '2018/11/13',
            userRemark: '用户备注',
            venderName: '无极限',
            venderOrder: '1234567890',
            productNameplate: '净水器',
            productModel: 'L-W309',
            writeDate: '2018/11/12/ 15:35:25',
            workOrderState: '已响应 待下派',
            contacts: []
        },
        {
            id: '10',
            customerName: '罗先生',
            customerAddress: '河南省郑州市金水区文劳路中海锦苑12号楼1单元507室',
            customerTel: '13150912686',
            workOrder: 'B2018111200158',
            identification: '1',
            expectDate: '2018/11/13',
            userRemark: '用户备注',
            venderName: '无极限',
            venderOrder: '1234567890',
            productNameplate: '净水器',
            productModel: 'L-W309',
            writeDate: '2018/11/12/ 15:35:25',
            workOrderState: '已响应 待下派',
            contacts: []
        },
        {
            id: '11',
            customerName: '罗先生',
            customerAddress: '河南省郑州市金水区文劳路中海锦苑12号楼1单元507室',
            customerTel: '13150912686',
            workOrder: 'B2018111200158',
            identification: '1',
            expectDate: '2018/11/13',
            userRemark: '用户备注',
            venderName: '无极限',
            venderOrder: '1234567890',
            productNameplate: '净水器',
            productModel: 'L-W309',
            writeDate: '2018/11/12/ 15:35:25',
            workOrderState: '已响应 待下派',
            contacts: []
        },
    ],
    // 工单联系人数据
    workOrderUserNews: [],
    // 查看工单数据
    seeWorkOrder: {},
    //挂起
    visibleHang: false,
    //服务站
    visibleService: false,
    //用户信息的数据
    userKeep:{},
    //工单分配的数据
    userMovey:{},
    //仓库的工单路径数据
    warehouseSidexData: [
        {
            title: '工单管理',
            scr: '/main/work_order',
            key: 0
        },
    ],
    //二级菜单的名称
    warehouseSidexTitle:'工单管理',
    // 维修工单的弹窗控制
    weixiuBox: false,
    baoyangBox:false,
    //安装维修保养响应工单
    responseweixiu: false,
    responsebaoyang: false,
    responseanzhuang:false,
    remindBox:false,


    // 盘点单
    stockTakingData:[],
    stockTakingDataT:[],

    region,
}
export default state