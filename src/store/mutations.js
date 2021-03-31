const mutations = {
    //分类选择
    SET_CLASSPOPUP: (state, visible) => {
        state.classVisible = visible
    },
    //设置分类回调
    SET_CLASSCALLBACK:(state, callback) => {
        state.classCallback = callback
        console.log(callback)
    },
    //详情弹窗
    SET_DETAILPOPUP: (state, detailvisible)=> {
        state.detailvisible = detailvisible
    },
    //编辑抽屉
    SET_VISIBLEEDIT: (state, visibleEdit)=> {
        state.visibleEdit = visibleEdit
    },
    //快速制单
    SET_VISIBLTOUCHING: (state, visibleTouchingDetail)=> {
        state.visibleTouchingDetail = visibleTouchingDetail
    },
    // 工单数据
    SET_WORKORDER: (state, workOrderData) => {
        // console.log(workOrderData);
        state.workOrderData.push(workOrderData)
    },
    // 工单联系人信息
    SET_WORKORDERUSERNEWS: (state, workOrderUserNews) => {
        // console.log(workOrderUserNews);
        state.workOrderUserNews.push(workOrderUserNews)
    },
    // 查看工单数据
    SET_SEEWORKORDER: (state, seeWorkOrder) => {
        console.log(seeWorkOrder);
        state.seeWorkOrder = seeWorkOrder
    },
    //响应详情弹窗
    SET_VISIBLERESPOND: (state, visibleRespondDetail)=> {
        state.visibleRespondDetail = visibleRespondDetail
    },
    //响应--响应详情弹窗 传递数据
    SET_RESPONDDATA: (state, respondData)=> {
        // console.log(respondData);
        state.respondData = respondData;
    },
    //分配工单
    SET_VISIBLMOVEY: (state, visibleMovey)=> {
        state.visibleMovey = visibleMovey
    },
    //信息详情
    SET_VISIBLPARTIC: (state, visiblePartic)=> {
        state.visiblePartic = visiblePartic
    },
    //挂起
    SET_VISIBLHANG: (state, visibleHang)=> {
        state.visibleHang = visibleHang
    },
    //服务站
    SET_VISIBLSERVICR: (state, visibleService)=> {
        state.visibleService = visibleService
    },
    //用户信息的数据
    SET_USERKEEP: (state, userKeep) => {
        state.userKeep = userKeep
    },
    //分配工单的数据
    SET_USERMOVEY: (state, userMovey)=> {
        state.userMovey = userMovey
    },
    SET_WAREHOUSEDATA: (state, value) => {
        state.warehouseSidexData = value
    },
    SET_WAREHOUSETITLE: (state, value) => {
        state.warehouseSidexTitle = value
    },
    SET_WEIXIUBOX:(state,value)=>{
        state.weixiuBox = value

    },
    SET_BAOYANGBOX:(state,value)=>{
        state.baoyangBox = value
    },

    SET_RESPONSEWX:(state,value)=>{
        state.responseweixiu = value
    },
    SET_RESPONSEBY: (state, value) => {
        state.responsebaoyang = value
    },
    SET_RESPONSEAZ: (state, value) => {
        state.responseanzhuang = value
    },
    SET_REMIND: (state, value) => {
        state.remindBox = value
    },
    SET_STOCKTAKINGDATA:(state,value)=>{
        state.stockTakingData = value

    },
    SET_STOCKTAKINGDATAT: (state, value) => {
        state.stockTakingDataT = value
        console.log(state.stockTakingDataT)
    },
    
}
export default mutations