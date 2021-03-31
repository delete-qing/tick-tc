componentsName:ExportExcel
Author:Felx
CreateTime:2019-07-29 11:06


一、用法
1、安装组件
yarn add better-xlsx
yarn add file-saver

2、在需要导出的页面引入ExportExcel
```javascript
import exportExcel from '@/components/ExportExcel'
```
3、事件回掉中调用方法
```javascript
this.exportExcel(columns, datasource, params)
```
4、参数说明
```javascript
columns = [  //表头结构
  { title: '姓名' },
  { title: '班级' },
  {
    title: '分数',
    children: [{ title: '语文' }, { title: '数学' }]
  }
]
datasource = [ //数据
  {
    '姓名': '张三',
    '班级': '三年二班',
    '语文': '98',
    '数学': '100'
  }
]
params = { //其他配置参数
  fileName: '三年级期终考试成绩汇总',
  sheetName: '三年二班成绩单'
}
```

二、其他
需要其他配置，如表格线条的粗细、默认字体、子号等，后期再加，在组件中的cell.style中添加
