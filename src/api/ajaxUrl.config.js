// 机构表
const sysOffice = {
    //查询车间班组  
    findShopAreaTree: '/sys/sysOffice/findShopAreaTree',
    list: '/sys/sysOffice/list',
    queryById: '/sys/sysOffice/queryById',
    exportWord: '/sys/sysOffice/exportWord'//机构导出

}
// 任务源管理 
const enTaskInfo = {
    add: '/task/enTaskInfo/add',
    delete: '/task/enTaskInfo/delete',
    edit: '/task/enTaskInfo/edit',
    pageList: '/task/enTaskInfo/pageList',
    queryById: '/task/enTaskInfo/queryById',
    weekAdd: '/task/enTaskInfo/weekAdd',
    queryWeekPageList: '/task/enTaskInfo/queryWeekPageList',
    findTaskPandect: '/task/enTaskInfo/findTaskPandect',
    findTaskPersonal: '/task/enTaskInfo/findTaskPersonal',
    remove: '/task/enTaskInfo/remove',
    queryEnTaskInfoById: '/task/enTaskInfo/queryEnTaskInfoById',
}
//任务分配表
const enTaskUser = {
    queryCondition: '/task/enTaskUser/queryCondition',
    edit: '/task/enTaskUser/edit'
}
//周计划
const buPlanWeek = {
    add: 'plan/buPlanWeek/add'
}
//字典表
const dict = {
    //标准下拉数据接口
    findDictForSelect: '/dict/dictDictionary/findDictForSelect',
    list: '/dict/dictDictionary/list',
    delete: '/dict/dictDictionary/delete',
    manageList: '/dict/dictManagement/list',
    add: '/dict/dictDictionary/add',
    edit: '/dict/dictDictionary/edit',
}
//客户与产品关联
const buCustomerPordcut = {
    queryCondition: '/customer/buCustomerPordcut/queryCondition',
}
//职工表
const basic = {
    pageList: '/basic/basicStaff/pageList',
    queryByOfficeId: '/basic/basicStaff/queryByOfficeId'
}

// 课程管理
const enCourse = {
    add: '/course/enCourse/add',
    delete: '/course/enCourse/delete',
    echoData: '/course/enCourse/echoData',
    edit: '/course/enCourse/edit',
    // 课程详情
    pageList: '/course/enCourse/pageList',
    queryById: '/course/enCourse/queryById',
    editCourse: '/course/enCourse/editCourse',
    // addVideo: '/course/enCourse/addChapter',
    chapterByCourseId: '/course/enCourse/chapterByCourseId',
    videoByChapterId: '/course/enCourse/videoByChapterId',//根据章节获取视频
    addChapter: '/course/enCourse/addChapter',
    editChapter: '/course/enCourse/editChapter',
    deleteChapter: '/course/enCourse/deleteChapter',//删除章节
    addVideo: '/course/enCourse/addVideo',//添加视频
    deleteVideo: '/course/enCourse/deleteVideo',//删除视频
    getTopic: '/course/enCourse/getTopic',//根据章节id查看考题 
    editOption: '/course/enCourse/editOption',//根据id编辑题目
    addSelect: '/course/enCourse/addSelect',//添加状态
    addSelect: '/course/enCourse/addSelect',//添加单选多选判断
    addTopic: '/course/enCourse/addTopic',//添加题目
    addOption: '/course/enCourse/addOption',//添加选项
    deleteTopic: '/course/enCourse/deleteTopic',//删除题
    courseRegistration: '/course/enCourse/courseRegistration',//报名
    isNotRegistration: '/course/enCourse/isNotRegistration',//查询是否报名
    sendTestData: '/course/enCourse/sendTestData',//试卷头部
    testSet: '/course/enCourse/testSet',//设置考题

}
// 统计分析
const stCourseOrder = {
    pageList: '/course/stCourseOrder/pageList',
    courseStatistics: '/course/stCourseOrder/courseStatistics',
    getList: '/sys/sysOffice/getList',

}
// 账号审核  个人中心
const basicStaff = {
    accountAudit: '/basic/basicStaff/accountAudit',
    pass: '/basic/basicStaff/pass',
    batchPass: '/basic/basicStaff/batchPass',
    batchSendBack: '/basic/basicStaff/batchSendBack',
    sendBack: '/basic/basicStaff/sendBack',
    list: '/basic/basicStaff/list',//个人中心数据
    edit: '/basic/basicStaff/edit',//修改个人数据
    getOfficeData: '/basic/basicStaff/getOfficeData',//机构统计
    queryLastStudy: '/course/buCourseStudyTeacher/queryLastStudy',//测试
    saveAndUpdate: '/basic/basicStaff/saveAndUpdate',//人员修改
    phoneAndEmail: '/basic/basicStaff/phoneAndEmail'//管理员修改人员信息

}
// 课程学习
const buCourseStudyTeacher = {
    studyTeacherList: '/course/buCourseStudyTeacher/studyTeacherList',//最近学习列表
    studyTeacherSubject: '/course/buCourseStudyTeacher/studyTeacherSubject',//点击分类
    keepLearningAndDetails: '/course/buCourseStudyTeacher/keepLearningAndDetails',//视频页数据
    getCourseName: '/course/buCourseStudyTeacher/getCourseName',//根据教师ID查询出已报名的课程名字
    queryLastStudy: '/course/buCourseStudyTeacher/queryLastStudy',//根据教师id、课程id查询最近学习记录
    edit: '/course/buCourseStudyTeacher/edit',//修改本次教师学习记录
    startTest: '/course/buCourseStudyTeacher/startTest',//开始考试
    saveChapterTest: '/course/buCourseStudyTeacherChapter/saveChapterTest',//提交考试
    selectChapterTest: '/course/buCourseStudyTeacherChapter/selectChapterTest',//查询考试详情
}
// 首页设置
const dictSysConfig = {
    pageList: '/course/dictSysConfig/pageList',//首页设置查看
    edit: '/course/dictSysConfig/edit',//编辑
    indexList: '/course/dictSysConfig/indexList',//首页列表查询
    interest: '/course/dictSysConfig/interest',//兴趣选择
    getUserStudyData: '/course/dictSysConfig/getUserStudyData',//人员信息小框框
}

// 考题的导入导出
const enCourseChapterTopic = {
    exportWord: '/course/enCourseChapterTopic/exportWord',//导入模板   
}

export {
    sysOffice,
    dict,
    enTaskInfo,
    buCustomerPordcut,
    basic,
    buPlanWeek,
    enTaskUser,
    enCourse,
    stCourseOrder,
    basicStaff,
    buCourseStudyTeacher,
    dictSysConfig,
    enCourseChapterTopic,
}