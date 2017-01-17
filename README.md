## h5+ and VUE模板工程
> A h5+ and VUE project

## 环境说明
###1.安装nodejs(编译和打包需要用到)，配置环境变量path
###2.svn下载项目工程
###3.打开命令行，进入到unpackage目录
###4.运行npm install 安装依赖
###5.运行npm run build 编译生成dist
###6.hbuilder-->运行-->手机运行,选择自己配置的手机即可
###7.npm run xbuild 这个指令是先进行域名替换，然后进行build的快捷指令



## 工程结构说明
>鉴于hbuilder的编译和发布机制没有地方配置，就将文件都建在了unpackage下面，只将发布的dist目录放在外面
	这样发布到手机端的代码就只有编译之后的代码，没有多余的代码了。
	

##工程目录说明
project
+---dist  编译之后的目录
|   +---buyer 买家
|   |   \---demo 
|   |           demo.html 
|   |           index.html 
|   +---seller 卖家
|   |   \---demo
|   +---commonpage  通用页面
|   |   \---demo
|   \---static 静态资源
|       +---css 
|       |      iconfont.css
|       |   +---buyer
|       |   |   \---demo
|       |   |           demo.css 页面的css
|       |   |---seller
|       |   |   \---demo
|       |   \---commonpage
|       |       \---demo
|       +---fonts
|       |       iconfont.ttf
|       +---img
|       |       empty.png
|       \---js
|           |   vendors.js 抽取的公共js
|           +---buyer
|           |   \---demo
|           |           demo.js 页面的js
|           +---seller
|           |   \---demo
|           \---commonpage
|               \---demo
\---unpackage
    +---build 编译脚本
    +---config 编译相关配置项
    +---doc 说明文档
    +---src 源码
    |   +---api api的相关
    |   +---common 工具类
    |   +---component 公共组件
    |   +---directive 自定义指令
    |   +---filter 过滤器
    |   +---headtpl 头部模板
    |   +---library 第三方js库
    |   +---static 静态资源
    |   |   +---css 
    |   |   +---fonts
    |   |   +---img
    |   |   \---js
    |   +---store vuex相关
    |   \---view  页面
    |       +---bizcomponent 跨模块的业务组件
    |       +---buyer 买家模块
    |       |   \---demo 子模块
    |       |       +---bizcomponent 子模块业务组件，里面可以再增加目录，作为自己组件的目录
    │       │       |               Demo.vue  组件
    |       |       +---demo 这个目录名称就是页面名称
    |       |       |   |   App.vue 业务承载组件
    |       |       |   |   index.html 页面
    |       |       |   |   index.js 入口文件
    |       |       |   \---assets 页面需要使用的静态资源
    |       |       |             logo.png  
    |       |       \---index
    |       |           \---assets
    |       +---seller 卖家模块
    |       |   \---demo
    |       |       +---bizcomponent
    |       |       +---demo
    |       |       |   \---assets
    |       |       \---index
    |       |           \---assets
    |       \---commonpage 跨模块的公共页面
    |           \---index
    |               \---assets
    \---test 测试目录
        +---e2e  e2e测试
        +---mock 模拟数据
        |   |   mockApi.js mock配置文件
        |   \---data
        \---unit 单元测试
            |   karma.conf.js  karma配置文件
            |   reports.html  测试报告
            \---spec 测试文件
                    dateFormat_spec.js
                    hello_spec.js
                    utils_spec.js
	        

###坑记录
1.在模板里面引用图片路径问题
		<img class="logo" src="./assets/img/bg.png">，直接使用相对路径可以
		<img class="logo" :src='imgl'>如果是计算属性，imgl:require(type==1?'./assets/img/logo.png':'./assets/img/bg.png')|||imgsrc:require('./assets/img/bg.png'),
		必须使用require引入图片
2.传递参数名必须使用全小写 ，驼峰会有问题
	props: {
		hello: String,
		propb: {
      type: String,
      required: true
    }
	},