componentsName:uploadFiles
Author:Felx
CreateTime:2019-07-29 11:06


一、用法
1.说明
该组件基于antd的upload再次封装,为了实现灵活的查看和适应后台上传文件处理方式
关于组件多次打开filelist不变的问题，是应为调用时未重新加载组件，所以写了一个reset()方法，
使用时，父组件调用reset方法，参数是新的id号

2、在需要导出的页面引入uploadFiles
```javascript
import uploadFiles from '@/components/uploadFiles'

components:{
  uploadFiles
}

<uploadFiles
  firstPath="hiddenDanger"
  secondPath="submit"
  tableName="file_hidden_danger"
  attributionId="C88F6D2AC0D000011AAEFF60F4501668"
></uploadFiles>
```

4、参数说明
```javascript

```

二、TODO
1. 实现基本上传文件功能 ( √ )
2. 实现不同类型文件查看功能
3. 实现编辑时获取和渲染数据  ( √ )
4. ...
