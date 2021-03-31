<template>
    <div class="clearfix">
        <!-- 这个是干嘛的？  这个是预览插件 -->
        <a-upload
                action="/tick-ov/sys/file/upload"
                listType="picture"
                :fileList="fileList"
                :data="fileVo"
                @preview="handlePreview"
                @change="handleChange"
                :multiple='true'

        >
            <div>
                <a-button icon="plus" class="ant-upload-text">上传</a-button>
            </div>
        </a-upload>
        <div class="float">
            <viewer :images="img" navbar="true" inline="true">
                <!-- //呗点击 -->
                <div class="delect" v-for="(item, index) in img" :key="index">
                    <span @click="delect(item)">x</span>
                    <img :src="upFileUrl+item.fileSrc" :key="item.title">
                </div>
            </viewer>
        </div>
        <a-modal
                title="提示框"
                :visible="visible"
                @ok="handleOk"
                :confirmLoading="confirmLoading"
                @cancel="handleCancel1"
        >
            <p>确定删除吗？</p>
        </a-modal>
    </div>

</template>
<script>
    import {getAction, deleteAction, postAction} from "@/api/manage";

    export default {
        props: ['fileVo'],
        data() {
            return {
                previewVisible: false,
                previewImage: "",
                visible: false,
                confirmLoading: false,
                fileList: [],
                attributionId: '', //自动生成UUID
                firstPath: "person", //从父页面传递过来,将值放入fileVo中
                secondPath: "secondPath", //从父页面传递过来,将值放入fileVo中
                tableName: "", //从父页面传递过来,将值放入fileVo中
                // fileVo: {
                //   attributionId: this.addFormId,
                //   firstPath: "car",
                //   secondPath: "photo",
                //   tableName: "file_car_photo"
                // },
                img: [],
                qita: [],
                item: {},
                cData: {},
                upFileUrl: 'http://localhost/upFiles/'
            };
        },
        methods: {
            guanbi() {
                this.previewVisible = false;
            },
            showModal() {
                this.visible = true
            },
            handleOk(e) {
                this.confirmLoading = true;
                setTimeout(() => {
                    let data = {
                        id: this.item.id,
                        tableName: this.fileVo.tableName
                    };
                    deleteAction("/sys/file/delete", data)
                        .then(res => {
                            this.$message.success(res.message);
                            this.loadData();
                        }).catch(err => {
                        console.log(err);
                    });
                    this.visible = false;
                    this.confirmLoading = false;
                }, 1000);
            },
            handleCancel1(e) {
                // console.log('Clicked cancel button');
                this.visible = false;
            },
            handleCancel() {
                this.previewVisible = false;
            },
            handlePreview(file) {
                //图片
                //dianji
                if (".jpg|.jpeg|.gif|.png|.bmp|.JPG|.JPEG|.GIF|.PNG|.BMP".indexOf(file.fileSuffix) > -1) {
                    //图片在线弹出窗口预览（viewerjs）
                    this.previewVisible = true

                } else {
                    //使用downLoadjs，下载对应的文件（通过file.url获取对应的地址）
                    // console.log(file)
                    // download(file.url)
                }
                this.previewImage = file.url || file.thumbUrl;
            },
            handleChange({file}) {
                this.item.id = file.id;
                var _this = this;
                // console.log(file.status);
                if (file.status == "removed") {
                    this.visible = true
                } else if (file.status == "uploading") {
                    setTimeout(function () {
                        console.log('uploading')
                        _this.loadData();
                    }, 2000)
                    //
                } else if (file.status == "done") {
                    console.log('完成')
                    // this.loadData()
                } else {
                    // console.log(err)
                    // this.loadData()
                }
            },
            // handleRemove({ file }) {
            //   console.log(file)
            // },
            delect(item) {
                this.visible = true
                this.item = item
                // console.log(item)
            },
            loadData() {
                if (!window.location.href.indexOf("localhost")) {
                    this.upFileUrl = "http://10.99.69.236:9081/upFiles/";
                }
                getAction("/sys/file/list", this.fileVo)
                    .then(res => {
                        console.log(res);
                        $.each(res.result, function (i, e) {
                            e.uid = e.id;
                            e.name = e.fileName;
                            e.status = 'done';
                            e.url = this.upFileUrl + e.fileSrc;
                            e.thumbUrl = e.url;
                        });
                        // console.log(1)
                        this.fileList = res.result;
                        this.img = []
                        this.qita = []
                        var a = this.fileList.length
                        for (let index = 0; index < a; index++) {
                            if (".jpg|.jpeg|.gif|.png|.bmp|.JPG|.JPEG|.GIF|.PNG|.BMP".indexOf(this.fileList[index].fileSuffix) > -1) {
                                this.img.push(this.fileList[index])
                            } else {
                                this.qita.push(this.fileList[index])
                            }
                            // if (index == a - 1) {
                            //     // console.log(this.qita)
                            //     this.fileList = this.qita
                            // }
                        }
                        this.fileList = this.img.concat(this.qita)
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        },
        created() {
            this.loadData();
            // console.log(this.fileVo);
        },
        // watch: {
        //   fileVo(newVal,oldVal){
        //     console.log(newVal,oldVal);
        //     // this.cData = newVal;
        //     // this.drawChart();
        //   }
        // },
    };
</script>
<style lang="scss">
    /* you can make up upload button and sample style by using stylesheets */
    .clearfix {
        .float {
            border: 2px solid #d9d9d9;
            border-radius: 5px;
            padding: 5px;
            margin: 10px 0;
            width: 70%;

            img {
                margin: 5px;
                width: 100px;
                height: 80px;
            }
            .delect {
                display: inline-block !important;
                position: relative;
                span {
                    cursor: pointer;
                    text-align: center;
                    line-height: 10px;
                    color: #fff;
                    position: absolute;
                    display: block;
                    width: 15px;
                    height: 15px;
                    right: 0px;
                    top: 0px;
                    background: red;
                    border-radius: 50px;
                }
            }

        }
    }

    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }

    .ant-carousel .slick-slide {
        text-align: center;
        height: 400px;
        line-height: 160px;
        background: #364d79;
        overflow: hidden;
    }

    .ant-carousel .slick-slide h3 {
        color: #fff;
    }

    .ant-upload-list.ant-upload-list-picture {
        width: 70%;
        // display: none;
    }

</style>