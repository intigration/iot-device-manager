<template>
<el-container class="container" id="work-container">
    <el-aside width="200px">
        <div class="template-box">
            <div class="header">模板列表
                <i class="el-icon-circle-plus-outline add" title="新建" @click="handleClickTemp()"></i>
            </div>
            <ul class="template-list">
                <li class="item" :class="{'active':item.isActive}" v-for="item in templateList" :key="item.key" @click="handleClickTemp(item.key)">
                    {{item.name}}
                    <!-- <router-link to="/demo-chart/fir"></router-link> -->
                </li>
            </ul>
        </div>
    </el-aside>
    <el-main>
        <el-button class="btn-save" @click="saveChart" type="success">保存</el-button>
        <el-button class="btn-save-img" @click="saveChartImg" type="info">保存为图片</el-button>
        <div class="workplace" id="workplace">
            <!-- <div class="workplace-chart" id="start">
          <i class="el-icon-loading circle"></i>
          <span>开始</span>
          <div class="ep"></div>
        </div> -->
            <template v-for="(item, idx) in chartData.nodes">
                <chart-group v-if="item.type === 'group'" v-bind="item" :key="idx" @resize="resizeGroup"></chart-group>
                <chart-node v-else v-bind="item" :key="idx" @edit="editNode(item,idx)"></chart-node>
            </template>
        </div>
    </el-main>
    <el-aside width="200px">
        <div class="box-card" v-for="(item,idx) in list" :key="idx">
            <div class="header">模块{{idx+1}}</div>
            <div class="card-body">
                <div class="item" v-for="(item2,idx2) in item" :key="idx2" :data-icon="item2.icon" :data-text="item2.name" :data-type="item2.type">
                    <i :class="[item2.icon,item2.type]"></i>
                    <span class="text">{{item2.name}}</span>

                </div>
            </div>
        </div>
    </el-aside>

    <!-- 模型保存弹出层 -->
    <el-dialog title="智能模型保存" :visible.sync="dialogFormVisible">
        <el-form :model="chartForm" ref="chartForm" :label-width="formLabelWidth">
            <el-form-item label="模型名称">
                <el-input v-model="chartForm.name" auto-complete="off" placeholder="请输入模型名称"></el-input>
            </el-form-item>
            <el-form-item label="批注内容">
                <el-input type="textarea" :autosize="true" v-model="chartForm.msg" auto-complete="off" placeholder="请输入模型批注内容"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelSave">取 消</el-button>
            <el-button type="primary" @click="submitSave">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 节点属性设置弹出层 -->
    <el-dialog :visible.sync="dialogFormVisible2">
        <div slot="title">属性设置</div>
        <el-form :model="nodeForm" ref="nodeForm" :label-width="formLabelWidth">
            <el-form-item label="开始时间">
                <el-date-picker v-model="nodeForm.startTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker v-model="nodeForm.endTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="最小出现天数">
                <el-input v-model="nodeForm.minDays" placeholder="请输入最小出现天数" style="width:100px"></el-input>
                <span>（请输入大于0的整数）</span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveNodeEdit">确 定</el-button>
                <el-button @click="cancelSaveNodeEdit">取 消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

    <div id="canvasDiv" style='display: none;'></div>

</el-container>
</template>

<script>
import ChartNode from "../components/ChartNode";
import ChartGroup from "../components/ChartGroup";
// import html2canvas from "html2canvas";
export default {
    name: "DemoChart",
    data() {
        return {
            dialogFormVisible: false,
            dialogFormVisible2: false,
            chartForm: {
                name: "",
                msg: ""
            },
            formLabelWidth: "100px",
            nodeForm: {
                startTime: "",
                endTime: "",
                minDays: ""
            },
            templateList: [{
                    name: "模板一",
                    key: "json.1"
                },
                {
                    name: "模板二",
                    key: "json.2"
                }
            ],
            list: [
                [{
                        icon: "el-icon-menu",
                        name: "节点1-1",
                        type: "diamond"
                    },
                    {
                        icon: "el-icon-star-on",
                        name: "节点1-2",
                        type: "diamond"
                    },
                    {
                        icon: "el-icon-location",
                        name: "节点1-3",
                        type: "diamond"
                    }
                ],
                [{
                        icon: "el-icon-date",
                        name: "节点2-1",
                        type: "diamond"
                    },
                    {
                        icon: "el-icon-time",
                        name: "节点2-2",
                        type: "diamond"
                    },
                    {
                        icon: "el-icon-bell",
                        name: "节点2-3",
                        type: "diamond"
                    }
                ],
                [{
                        icon: "el-icon-tickets",
                        name: "节点3-1",
                        type: "circle"
                    },
                    {
                        icon: "el-icon-upload",
                        name: "结束",
                        type: "circle"
                    }
                ],
                [{
                    icon: "el-icon-more",
                    name: "组",
                    type: "group"
                }]
            ],
            jsp: null,
            chartData: {
                nodes: [{
                    id: "start",
                    icon: "el-icon-loading",
                    type: "circle",
                    text: "开始",
                    nodeStyle: {
                        top: "100px",
                        left: "300px"
                    }
                }],
                connections: [],
                props: {}
            }
        };
    },
    mounted() {
        const _self = this;

        jsPlumb.ready(() => {
            // 默认配置
            var instance = jsPlumb.getInstance({
                Endpoint: [
                    "Blank",
                    {
                        cssClass: "chart-dot",
                        hoverClass: "chart-dot-hover",
                        radius: 5
                    }
                ],
                Connector: "Straight",
                HoverPaintStyle: {
                    stroke: "#1e8151",
                    strokeWidth: 2
                },
                ConnectionOverlays: [
                    [
                        "Arrow",
                        {
                            location: 1,
                            visible: true,
                            width: 11,
                            height: 11,
                            id: "Arrow"
                        }
                    ]
                    // ["Label", { label: "-", id: "label", cssClass: "aLabel" }]
                ],
                Container: "workplace"
            });
            this.jsp = instance;

            var canvas = document.getElementById("workplace");

            // 删除连接线
            // instance.bind("click", function(c) {
            //   instance.deleteConnection(c);
            // });

            // 监听 connection 事件
            instance.bind("connection", function (info) {
                // info.connection.getOverlay("label").setLabel(info.connection.id);
            });
            // 连接线删除时触发
            instance.bind("connectionDetached", function (connection) {
                console.log(connection)
                _self.chartData.connections.forEach((conn, idx) => {
                    if (connection.sourceId === conn.sourceId && connection.targetId === conn.targetId) {
                        _self.chartData.connections.splice(idx, 1)
                    }
                });
            });
            // 监听拖动connection 事件，判断是否有重复链接
            instance.bind("beforeDrop", function (info) {
                // info.connection.getOverlay("label").setLabel(info.connection.id);
                console.log(info);
                // 判断是否已有该连接
                let isSame = true;
                _self.chartData.connections.forEach(item => {
                    if (
                        (item.targetId === info.targetId &&
                            item.sourceId === info.sourceId) ||
                        (item.targetId === info.sourceId && item.sourceId === info.targetId)
                    ) {
                        isSame = false;
                    }
                });
                if (isSame) {
                    _self.chartData.connections.push({
                        targetId: info.targetId,
                        sourceId: info.sourceId
                    });
                } else {
                    _self.$message.error("不允许重复连接！");
                }
                return isSame;
            });

            instance.bind("group:addMember", function (p) {
                console.log(p)
                if (p.el.id === 'start') {
                    _self.$message.warning('开始节点不能拖入组中！')
                    instance.removeFromGroup(p.el);
                }
                instance.deleteConnectionsForElement(p.el)
            });
            instance.bind("group:removeMember", function (p) {
                console.log(p)
            });
            instance.bind("group:expand", function (p) {
                console.log(p)
            });
            instance.bind("group:collapse", function (p) {
                console.log(p)
            });
            instance.bind("group:add", function (p) {
                console.log(p)
            });
            instance.bind("group:remove", function (p) {
                console.log(p)
            });

            // bind a double click listener to "canvas"; add new node when this occurs.
            // jsPlumb.on(canvas, "dblclick", function(e) {
            //   newNode(e.offsetX, e.offsetY);
            // });
            // 将模块拖入画板中
            $(".box-card .item").draggable({
                scope: "plant",
                helper: "clone",
                containment: $("#work-container")
            });
            $("#workplace").droppable({
                scope: "plant",
                drop: function (ev, ui) {

                    let helper = ui.helper;
                    let id = jsPlumbUtil.uuid();
                    let item = {
                        id,
                        icon: helper.attr("data-icon"),
                        type: helper.attr("data-type"),
                        text: helper.attr("data-text"),
                        nodeStyle: {
                            top: ui.position.top - 60 + "px",
                            left: ui.position.left - 200 + "px"
                        }
                    };

                    _self.chartData.nodes.push(item);
                    _self.$nextTick(() => {
                        _self.initNode(id);
                        if (item.type === 'group') {
                            instance.addGroup({
                                el: document.getElementById(id), // 必须为 dom对象
                                id: 'g_' + id,
                                droppable: true,
                                dropOptions: {
                                    drop: function (p) {
                                        console.log(p)
                                        return true;
                                    },
                                },
                                orphan: true,
                            })
                            jsPlumb.fire("jsPlumbDemoGroupAdded", instance);
                        }
                    });
                }
            });

            // 暂停渲染，执行以下操作
            instance.batch(() => {
                jsPlumb.getSelector(".workplace-chart").forEach(item => {
                    _self.initNode(item);
                });
            });
            jsPlumb.fire("jsPlumbDemoLoaded", instance);
        });
    },
    methods: {
        // 初始化node节点
        initNode(el) {
            // initialise draggable elements.
            // 元素拖动，基于 katavorio.js 插件
            let _self = this;
            this.jsp.draggable(el, {
                filter: ".resize",
                // containment: true,
                start(params) {
                    // 拖动开始
                    // console.log(params);
                },
                drag(params) {
                    // 拖动中
                    // console.log(params);
                },
                stop(params) {
                    // 拖动结束
                    console.log(params);
                    let id = params.el.id;
                    _self.$nextTick(() => {
                        let top = params.el.style.top
                        let left = params.el.style.left
                        _self.chartData.nodes.forEach(item => {
                            if (item.id === id) {
                                item.nodeStyle.left = left;
                                item.nodeStyle.top = top;
                            }
                        });
                    })
                }
            });

            this.jsp.makeSource(el, {
                filter: ".ep",
                // anchor: "Continuous",
                anchor: ["Perimeter", {
                    shape: "Rectangle"
                }],
                connectorStyle: {
                    stroke: "#5c96bc",
                    strokeWidth: 2,
                    outlineStroke: "transparent",
                    outlineWidth: 4
                },
                extract: {
                    action: "the-action"
                },
                maxConnections: -1,
                onMaxConnections: function (info, e) {
                    alert("Maximum connections (" + info.maxConnections + ") reached");
                }
            });

            this.jsp.makeTarget(el, {
                dropOptions: {
                    hoverClass: "dragHover"
                },
                anchor: ["Perimeter", {
                    shape: "Rectangle"
                }],
                allowLoopback: false
            });

            // this is not part of the core demo functionality; it is a means for the Toolkit edition's wrapped
            // version of this demo to find out about new nodes being added.
            //
            this.jsp.fire("jsPlumbDemoNodeAdded", el);
        },
        // 保存
        saveChart() {
            this.dialogFormVisible = true;
            // console.log(this.jsp.getConnections());
            console.log(this.chartData);
            // jsPlumb.repaintEverything();
        },
        /**
         * @description 取消保存
         */
        cancelSave() {
            this.dialogFormVisible = false;
            this.chartForm = {
                name: "",
                msg: ""
            };
            this.$message.info("已取消保存");
        },
        submitSave() {
            this.dialogFormVisible = false;
            this.chartData.props = this.chartForm;
            this.$message.success("保存成功");
        },
        /**
         * @description 模板点击事件
         * @param {String} key 模板关键值
         */
        handleClickTemp(key) {
            this.chartData = {
                nodes: [],
                connections: [],
                props: {}
            };
            this.jsp.empty("workplace");
            if (key) {
                this.templateList.forEach(item => {
                    if (item.key === key) {
                        item.isActive = true;
                    } else {
                        item.isActive = false;
                    }
                });
                // let url = "./static/json/" + key + ".json";
                let url = "/static/json/" + key + ".json";

                this.$axios
                    .get(url)
                    .then(resp => {
                        console.log(resp);
                        this.chartData = resp.data;
                        this.$nextTick(() => {
                            this.chartData.nodes.forEach(item => {
                                this.initNode(item.id);
                            });
                            // this.jsp.empty();
                            this.chartData.connections.forEach(item => {
                                this.jsp.connect({
                                    source: item.sourceId,
                                    target: item.targetId
                                });
                            });
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                this.$nextTick(() => {
                    this.chartData.nodes.push({
                        id: "start",
                        icon: "el-icon-loading",
                        type: "circle",
                        text: "开始",
                        nodeStyle: {
                            top: "100px",
                            left: "300px"
                        }
                    });
                    this.$nextTick(() => {
                        this.jsp.batch(() => {
                            this.initNode(jsPlumb.getSelector("#start"));
                        });
                    });
                });
            }
        },
        /**
         * @description 双击触发节点编辑事件
         * @param {Object} item 节点当前数据
         * @param {Number} idx 下标
         */
        editNode(item, idx) {
            this.dialogFormVisible2 = true;
        },
        /**
         * @description 触发节点缩放事件
         * @param {Object} item 节点当前数据
         * @param {Number} idx 下标
         */
        resizeGroup(el) {
            console.log(el)
            this.$nextTick(() => {
                this.jsp.repaintEverything()
            })
        },
        /**
         * @description 节点编辑保存
         */
        saveNodeEdit() {
            // 验证表单
            if (this.verifyNodeForm()) {
                this.$message.success("保存成功");
                this.dialogFormVisible2 = false;
            }
        },
        /**
         * @description 节点保存验证
         */
        verifyNodeForm() {
            console.log(this.nodeForm);
            let flag = false;
            if (this.nodeForm.startTime === "") {
                this.$message.warning("开始时间不能为空！");
            } else if (this.nodeForm.endTime === "") {
                this.$message.warning("结束时间不能为空！");
            } else if (this.nodeForm.minDays === "") {
                this.$message.warning("最小天数不能为空！");
            } else if (
                this.nodeForm.startTime.getTime() >= this.nodeForm.endTime.getTime()
            ) {
                this.$message.warning("开始时间必须小于结束时间！");
            } else if (
                !Number.isInteger(this.nodeForm.minDays - 0) ||
                this.nodeForm.minDays - 0 <= 0
            ) {
                this.$message.warning("请输入大于0的整数！");
            } else {
                flag = true;
            }
            return flag;
        },
        /**
         * @description 取消保存
         */
        cancelSaveNodeEdit() {
            this.dialogFormVisible2 = false;
        },
        /**
         * @description 保存为图片
         */
        saveChartImg() {
            var statemachinediv = document.getElementById("workplace");

            html2canvas(statemachinediv, {
                onrendered: function (canvas) {
                    console.log(canvas);

                    $("#canvasDiv").empty();
                    document.getElementById("canvasDiv").appendChild(canvas);
                    var svgList = $(statemachinediv).find("svg");

                    svgList.each(function (index, value) {
                        try {
                            var svgExample = this;

                            var serializer = new XMLSerializer();
                            var svgMarkup = serializer.serializeToString(svgExample);
                            console.log(svgMarkup);

                            if (svgMarkup.indexOf("_jsPlumb_connector") > -1) {
                                var leftIndex = svgMarkup.indexOf("left: ");
                                var endOfLeft = svgMarkup.indexOf("px", leftIndex);
                                var leftPosition = svgMarkup.substring(
                                    leftIndex + 6,
                                    endOfLeft
                                );
                                var left = parseInt(leftPosition);

                                var topIndex = svgMarkup.indexOf("top: ");
                                var endOfTop = svgMarkup.indexOf("px", topIndex);
                                var topPosition = svgMarkup.substring(topIndex + 5, endOfTop);
                                var top = parseInt(topPosition);

                                svgMarkup = svgMarkup.replace(
                                    'xmlns="http://www.w3.org/2000/svg"',
                                    ""
                                );

                                var connectorCanvas = document.createElement("canvas");
                                canvg(connectorCanvas, svgMarkup); //add connector to canvas

                                var context = canvas.getContext("2d");
                                context.drawImage(connectorCanvas, left, top);
                            }
                        } catch (err) {
                            showBalloon("error in print");
                        }
                    });

                    let ctx = canvas.getContext("2d");

                    var image = canvas
                        .toDataURL("image/png")
                        .replace("image/png", "image/octet-stream");
                    // window.location.href=image; // it will save locally
                    var saveFile = function (data, filename) {
                        var save_link = document.createElementNS(
                            "http://www.w3.org/1999/xhtml",
                            "a"
                        );
                        save_link.href = data;
                        save_link.download = filename;

                        var event = document.createEvent("MouseEvents");
                        event.initMouseEvent(
                            "click",
                            true,
                            false,
                            window,
                            0,
                            0,
                            0,
                            0,
                            0,
                            false,
                            false,
                            false,
                            false,
                            0,
                            null
                        );
                        save_link.dispatchEvent(event);
                    };

                    // 下载后的问题名
                    var filename = "下载.png";
                    // download
                    saveFile(image, filename);
                }
            });
        }
    },
    /* beforeRouteUpdate(to, from, next) {
      console.log(to, from, next);
    }, */
    watch: {
        $route(to, from) {
            console.log(to, from);

            // 对路由变化作出响应...
        }
    },
    components: {
        ChartNode,
        ChartGroup
    }
};
</script>

<style lang="scss">
.workplace {
    width: 100%;
    height: 100%;
    position: relative;
}

#start {
    top: 50px;
    left: 50px;
}

.group-demo {
    position: absolute;
    width: 250px;
    height: 250px;
    background: #ccc;
    top: 250px;
    left: 300px;
}
</style>
