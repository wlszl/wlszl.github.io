<template>
<div>
  <div v-for="(item, index) in listData" :key="index">
    <!-- ========= branch ===========树形结构中每个目录为一个独立的分支（branch），一级branch的index为X，二级branch的index为：X-X，三级branch的index为：X-X-X，以此类推 -->
    <!-- 层的编号（index）设计规则：一级分支用一个数字表示，二级用2个数字中间连一个“-”表示，三级分支用三个数字，每个数字中间连“-”……，比如：A-B-C-D-……，其中A表示所属一级分支编号，B表示所属二级分支编号，C表示所属三级分支编号……； -->
    <!-- id 前缀命名规则：branch的前缀为 lt-branch_ ，图标层的前缀为 lt-branch-icon_ ，图标基座的前缀为 lt-branch-icon-bg_ ，animation(动画)层前缀为：lt-branch-animation_，box层的前缀为 lt-branch-box_ 。层的 id 就是：前缀+编号 -->
    <!-- className 规则：所有分支branch都含有 lt-branch，所有的图标都包含：lt-branch-icon；所有一级分支都包含 lt-branch_level_1，二级分支包含：lt-branch_level_2，三级分支包含：lt-branch_level_3……；所有一级分支图标都包含：lt-branch-icon_level_1，所有二级分支图标包含：lt-branch-icon_level_2，所有三级图标包含：lt-branch-icon_level_3……，如果一个分支下面没有下级分支，那么该分支将包含：lt-branch-icon_level_0；当前被点击的分支包含：lt-branch_active，当前被点击的分支图标包含：lt-branch-icon_active，一级分支下级子孙分支被点击后该一级分支将包含：lt-branch_level_1_active，该一级分支的图标将包含： lt-branch-icon_level_1_active，二级分支下级子孙分支被点击后该二级分支将包含：lt-branch_level_2_active，该二级分支的图标将包含： lt-branch-icon_level_2_active，三级分支下级子孙分支被点击后该三级分支将包含：lt-branch_level_3_active，该三级分支的图标将包含： lt-branch-icon_level_3_active……。后面带有active的分支表示正在活动的分支，但只有点击可以打开新路由内容的branch（即在listData中该branch包含parameter属性）才能触发active。 -->
    <a :href="item.parameter">
      <div :id="'lt-branch_'+(branchLevel+(index+1))"
          :data-index="branchLevel+(index+1)"
          :class="branchClassName(branchLevel+(index+1))"
          :style="branchStyle(branchLevel+(index+1))"
          @click.prevent="clickBranch(branchLevel+(index+1), item.parameter)">
        <div :id="'lt-branch-icon-bg_'+(branchLevel+(index+1))"
             class='lt-branch-icon-Bg'
             :style="branchIconBgStyle"
             v-if="(getIcon(branchLevel+(index+1))&&item.children&&item.children.length>0)||(item.icon!==undefined&&item.icon.length===2)">
          <span :id="'lt-branch-icon_'+(branchLevel+(index+1))"
                :class='branchIconClassName(branchLevel+(index+1))'
                :style="branchIconStyle(branchLevel+(index+1))"
                v-if="(control['lt-branch-icon_'+(branchLevel+(index+1))]==='show')||(item.icon!==undefined&&item.icon.length===2)"></span>
        </div><span>{{item.name}}</span></div>
    </a>
    <!--=============== animation ================= 每个branch下都有个animation层，是用来实现伸缩动画的 -->
    <div :id="'lt-branch-animation_'+(branchLevel+(index+1))"
         :style="branchAnimationStyle(branchLevel+(index+1))">
      <!--=============== box ================= 每个branch下都有个box层，branch所有的下级分支都在box内，branch的展开和闭合就可以用box的显示隐藏来实现。另外box与左边框的距离可以实现上下级branch的缩进 -->
      <div :id="'lt-branch-box_'+(branchLevel+(index+1))"
          :style="branchBoxStyle(branchLevel+(index+1), item.children)">
        <branch :listData="item.children"
                :open="open"
                :openOnly="openOnly"
                :indent="indent"
                :spacing="spacing"
                :icon="icon"
                :iconSize="iconSize"
                :animation="animation"
                :clickBranchIndex="clickBranchIndex"
                @sendClickBranchIndex="getClickBranchIndex"
                :branchLevel="branchLevel+(index+1)+'-'"
                :depth="depth+1"
                v-if="item.children&&item.children.length>0"></branch>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import Branch from './branch'
import IconFont from './icon.json'

export default {
  name: 'branch',
  data () {
    return {
      control: {}, // -----------------控制各个branch,box,icon的展开或闭合状态
      animationTime: 0 // -----------动画执行时间
    }
  },
  components: {
    Branch
  },
  props: {
    branchLevel: { // ---------分支级别，顶级分支为x，二级分支为x-x，三级分支为x-x-x，以此类推，系统会自动分别一级一级往下传递
      default: 0
    },
    depth: { // ------------分支级别的深度，一级分支深度为0，二级分支深度为1，三级分支深度为2，以此类推，系统会自动分别一级一级往下传递
      default: 0
    },
    clickBranchIndex: '', // -----------被点击的分支index，用户在分支上点击（处于组件branch.vue中）后会触发sendClickBranchIndex事件，上一级组件（上一级branch.vue）监听到sendClickBranchIndex后再运行gitClickBranchIndex事件，gitClickBranchIndex事件里又触发sendClickBranchIndex事件往上传递，一直到组件tree.vue监听到sendClickBranchIndex事件后更改data中的clickBranchIndex，tree.vue下所有的组件都会接受到clickBranchIndex的更改
    // -------------------------------------------以上props内容用户不能控制，以下props用户可以设置-------------------------------
    listData: { // -----------json格式的数据，每个分支目录有name,parameter,icon,children四个个字段，name为分支的文字内容（必须有）。parameter为点击分支时跳转的路由地址,如果不跳转可省略parameter字段。icon为该分支前的图标地址（包括展开时和闭合时的图标，所以icon是个数组），如果使用默认图标icon字段可以省略。children为该分支的下级分支，如果没有下级分支children字段也可以省略
      default: function () {
        return []
      }
    },
    open: {// --设置初始状态下各分支展开或闭合情况:0为全部闭合，1为全部展开；2第一个分支展开其他都闭合，且同级分支始终只能有一个展开；3除了一级分支展开，其他分支全都闭合；4除了一级分支展开，其他分支全都闭合，并且一级分支不能闭合，一级分支没有图标
      default: 1
    },
    openOnly: {
      default: 0
    },
    indent: { // -----子级分支相对父级分支的缩进距离
      default: 24
    },
    spacing: { // ---------图标与文字之间的距离
      default: 20
    },
    icon: {
      default: 1 // ------icon等于0时表示用户不需要图标，为大于0的整数时为系统自带的图标，为数组时为自定义图标（Font-Awesome和阿里巴巴图标）作为图标，数组第一个元素为闭合时图标，第二个元素为展开时图标或者是闭合图标需要旋转的角度，当数组内元素为图片地址时，也可以用自定义图片做图标
    },
    iconSize: { // -----设置图标大小
      default: 25
    },
    animation: { // ---animation设为false时不使用动画
      default: 1
    }
  },
  methods: {
    clickBranch (index, parameter) { // -----------------------------branch 点击事件--------------------------------
      this.$listClick(parameter) // ----branch被点击时传递parameter给插件外的组件，插件外的组件通过给Vue的原型添加方法$listClick来获取参数parameter，并进行一系列的操作

      /* 如果没有动画，那么点击branch时直接就修改control值，否则就在执行完动画后在doAnimation中修改control值 */
      if (this.animation === false) {
        this.setControl(index)
        if (parameter) {
          this.$emit('sendClickBranchIndex', index)
        }
      } else {
        this.doRotate(index)
        this.doAnimation(index, parameter)
      }
    },
    setControl (index) { // -----设置this.control['lt-branch_' + index][0]的值，该值决定branch是展开还是闭合
      if (this.openOnly === 1) { // -------openOnly为1时通过循环将所有同级别的branch都关闭确保同级别只能展开一个分支
        let n = 1
        let el
        do {
          if ((this.branchLevel + n) !== index) {
            this.control['lt-branch_' + (this.branchLevel + n)][0] = 'close'
            // this.renewStyle([this.branchLevel + n]) // -------------------------这里renewStyle刷新的是所有同级的分支样式，函数结尾的renewStyle刷新的只是被点击的分支的style
          }
          n++
          el = document.getElementById('lt-branch_' + (this.branchLevel + n))
        } while (el)
      }

      if (this.control['lt-branch_' + index][0] === 'open' || this.control['lt-branch_' + index][0] === 1) {
        this.$set(this.control, 'lt-branch_' + index, ['close'])
      } else if (this.control['lt-branch_' + index][0] === 'close' || this.control['lt-branch_' + index][0] === 0) {
        this.$set(this.control, 'lt-branch_' + index, ['open'])
      }
    },
    getClickBranchIndex (index) { // ---------------------------------获取当前点击的branch的index，
      this.$emit('sendClickBranchIndex', index) // ---------并把该index值通过自定义事件传给父组件
    },
    branchStyle (id) { // --------branch的样式
      let branchStyle = ''
      if (this.control['lt-branch_' + id][0] === 'open' || this.control['lt-branch_' + id][0] === 1 || this.control['lt-branch_' + id][0] === 'always') {
        branchStyle = this.branchOpenStyle
      } else {
        branchStyle = this.branchCloseStyle
      }
      return `position: relative;
              text-align: left;
              ${branchStyle}`
    },
    branchClassName (id) { // ------------branch的className
      let branchClass = ''
      let theId = id.toString()
      let theChildren = ''
      let theData = ''

      if (this.depth === 0) { // --获取branch的children值，如果该branch没有children(即没有子分支)，就给它加上lt-branch_level_0样式
        theData = this.listData[id - 1]
        if (theData.children) theChildren = theData.children
      } else {
        theData = this.listData[theId.replace(this.branchLevel, '') - 1]
        if (theData.children) theChildren = theData.children
      }

      branchClass = 'lt-branch lt-branch_level_' + (this.depth + 1) // --------添加常规分支className和当前级别的className
      if (theChildren.length === 0) { // ------如果branch没有子分支，就给branch加上 lt-branch_level_0 样式
        branchClass += ' lt-branch_level_0'
      }
      if (theId.toString() === this.clickBranchIndex.toString().substring(0, theId.length)) { // ------判断是否为当前active状态branch的祖先，如果是就加上active状态的className
        branchClass += ' lt-branch_level_' + (this.depth + 1) + '_active'
      }
      /* 用被点击分支index减掉当前分支的index剩余部分包含一个"-"，即表示当前分支仅仅比被点击分支高一级（如果高一级以上，那么replace后剩余部分一定会包含多个"-"），为了消除特殊index带来的buger，在判断的时候clickBranchIndex和theId前都加了一个字母，并且最后得加一个判断："-"在第一个位置 */
      let str = ('a' + this.clickBranchIndex.toString()).replace(('a' + theId.toString()), '')
      if ((str.split('-').length - 1 === 1) && str.indexOf('-') === 0) {
        branchClass += ' lt-branch_active_parent'
      }
      if (theId.toString() === this.clickBranchIndex.toString()) { // ------判断是否为当前active状态branch，如果是就加上active状态的className
        branchClass += ' lt-branch_active'
      }
      return branchClass
    },
    getIcon (index) { // ---------图标来源（权重：listData > 参数icon > icon.json。如果一个branch没有子级，那么这个branch没有图标，但如果listData中该branch包含icon属性，那么这个branch哪怕没有子级它也有自己的图标）
      /* 从listData读取icon */
      let arr = index.toString().split('-')
      let privateIcon = this.listData[arr[arr.length - 1] - 1].icon
      if (privateIcon !== undefined && privateIcon.length === 2) {
        return privateIcon
      }
      /* 从用户输入的参数icon 和 icon.json（默认）读取icon */
      let icon = this.icon
      if (icon === '' || icon === 'undefined') icon = 1
      if (!isNaN(parseInt(icon))) {
        if (icon === 0 || icon === false) return false // -----icon等于0或者false时不显示图标
        icon = IconFont['icon' + icon] // ----------把icon.json里的数据赋予icon
      }

      return icon // -----不管用户是使用系统默认图标、自定义图片还是使用第三方图标或者在listData中定义图标，icon都为数组，数组第一个元素为展开时的图标，第二个元素为闭合时图标（数组元素可能是图片地址，也可能是代表第三方图标的className）
    },
    iconCloseStyle (index) { // -----图标闭合时的样式
      if (this.getIcon(index)[0].indexOf('/') > -1) { // -----------this.getIcon中的元素包含“/”说明用户使用自定义图片作为图标
        return `position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                font-size:${this.iconSize}px;
                background: url('${this.getIcon(index)[0]}') center no-repeat;`
      } else { // ---------------------------------------------此时用户使用默认图标或第三方图标库来作为图标
        return `position: absolute;
                font-size:${this.iconSize}px;
                top: 50%;
                transform: translateY(-50%);`
      }
    },
    iconOpenStyle (index) { // -----图标展开时的样式
      if (isNaN(parseInt(this.getIcon(index)[1]))) { // ---如果this.getIcon(index)第二个元素不是纯数字，它一定是与第一个元素代表完全不一样的图片或className。
        if (this.getIcon(index)[0].indexOf('/') > -1) { // -----------this.getIcon中的元素包含“/”说明用户使用自定义图片作为图标
          return `position: absolute;
                  top: 0;
                  left: 0;
                  bottom: 0;
                  right: 0;
                  font-size: ${this.iconSize}px;
                  background: url('${this.getIcon(index)[1]}') center no-repeat;`
        } else { // ---------------------------------------------此时用户使用默认图标或第三方图标库来作为图标
          return `position: absolute;
                  font-size:${this.iconSize}px;
                  top: 50%;
                  transform: translateY(-50%);`
        }
      } else { // ---如果this.getIcon(index)第二个元素是纯数字，它表示与第一个元素是一样的图片或className，只是需要顺时针旋转一个角度。
        let transform
        if (this.getIcon(index)[0].indexOf('/') > -1) { // ----如果是图片不需要上移
          transform = `transform: rotate(${this.getIcon(index)[1]}deg);`
        } else {
          transform = `transform: translateY(-50%) rotate(${this.getIcon(index)[1]}deg);`
        }
        return `${this.iconCloseStyle(index)}
                ${transform}`
      }
    },
    iconCloseClassName (index) { // ----------闭合时图标层的className
      if (!this.getIcon(index)) return ''
      if (this.getIcon(index)[0].indexOf('/') === -1) { // ---如果图标使用的不是图片（图片地址一定含有“/”）
        return this.getIcon(index)[0]
      }
      return ''
    },
    iconOpenClassName (index) { // ----------展开时图标层的className
      if (!this.getIcon(index)) return ''
      if (isNaN(parseInt(this.getIcon(index)[1])) && this.getIcon(index)[1].toString().indexOf('/') === -1) { // ---如果this.getIcon(index)第二个元素不是纯数字并且图标使用的不是图片（图片地址一定含有“/”）
        return this.getIcon(index)[1]
      } else if (!isNaN(parseInt(this.getIcon(index)[1]))) { // ---this.getIcon(index)第二个元素是纯数字，展开时图标层的className和闭合时图标层的className应该一样，只是在设置style时旋转一定的角度就可以了（角度的度数是this.getIcon(index)）
        return this.getIcon(index)[0]
      }
      return ''
    },
    branchIconStyle (index) { // ---------------------------------图标的样式-------------------------
      if (this.icon === 0) return ''
      let elIndex = document.getElementById('lt-branch-icon_' + index)
      let iconStyle
      if (elIndex) iconStyle = elIndex.style.cssText
      if (this.clickBranchIndex !== index || this.animation === false) { // ----禁止当前正处于动画状态的图标改变状态
        if (this.control['lt-branch_' + index][0] === 'open' || this.control['lt-branch_' + index][0] === 'always' || this.control['lt-branch_' + index][0] === 1) { // ----------分支展开或闭合的情况
          iconStyle = this.iconOpenStyle(index)
        } else {
          iconStyle = this.iconCloseStyle(index)
        }
      }
      return iconStyle
    },
    branchIconClassName (index) { // ---------------图标的className(当使用默认图标或第三方图标库时需要设定className)-------------------
      let iconClass = ''
      if (this.control['lt-branch_' + index][0] === 'open' || this.control['lt-branch_' + index][0] === 'always' || this.control['lt-branch_' + index][0] === 1) {
        iconClass += this.iconOpenClassName(index)
      } else {
        iconClass += this.iconCloseClassName(index)
      }

      iconClass += ' lt-branch-icon lt-branch-icon_level_' + (this.depth + 1) // --------添加常规分支图标className和当前级别图标的className
      let theId = index.toString()
      let theChildren = ''
      let theData = ''

      if (this.depth === 0) { // --获取branch的children值，如果该branch没有children(即没有子分支)，就给它加上lt-branch_level_0样式
        theData = this.listData[index - 1]
        if (theData.children) theChildren = theData.children
      } else {
        theData = this.listData[theId.replace(this.branchLevel, '') - 1]
        if (theData.children) theChildren = theData.children
      }

      if (theChildren.length === 0) { // ------如果branch没有子分支，就给branch加上 lt-branch-icon_level_0 样式
        iconClass += ' lt-branch-icon_level_0'
      }
      if (theId.toString() === this.clickBranchIndex.toString().substring(0, theId.length)) { // ------判断是否为当前active状态branch的祖先，如果是就加上active状态的className
        iconClass += ' lt-branch-icon_level_' + (this.depth + 1) + '_active'
      }
      if (theId.toString() === this.clickBranchIndex.toString()) { // ------判断是否为当前active状态branch，如果是就加上active状态的className
        iconClass += ' lt-branch-icon_active'
      }
      /* 用被点击分支index减掉当前分支的index剩余部分包含一个"-"，即表示当前分支仅仅比被点击分支高一级（如果高一级以上，那么replace后剩余部分一定会包含多个"-"），为了消除特殊index带来的buger，在判断的时候clickBranchIndex和theId前都加了一个字母，并且最后得加一个判断："-"在第一个位置 */
      let str = ('a' + this.clickBranchIndex.toString()).replace(('a' + index.toString()), '')
      if ((str.split('-').length - 1 === 1) && str.indexOf('-') === 0) {
        iconClass += ' lt-branch-icon_active_parent'
      }
      return iconClass
    },
    branchAnimationStyle (id) { // ----animation的样式
      let theStyle = ''
      if (this.control['lt-branch_' + id][0] === 'open' || this.control['lt-branch_' + id][0] === 'always' || this.control['lt-branch_' + id][0] === 1) {
        theStyle += this.animationOpenStyle
      } else if (this.control['lt-branch_' + id][0] === 'close' || this.control['lt-branch_' + id][0] === 0) {
        theStyle += this.animationCloseStyle
      }
      return theStyle
    },
    branchBoxStyle (id) { // -------------------------------------box的样式-----------------------
      return `margin:0px;
              padding:0px;
              border:0px;
              ${this.boxStyle}`
    },
    doAnimation (id, parameter) { // --------------------------------展开收缩动画--------------------------------------------
      if (this.control['lt-branch_' + id][0] !== 'always') { // --该branch的open值为always时不执行动画，因为该分支不能被闭合
        let elAnimation = document.getElementById('lt-branch-animation_' + id)
        elAnimation.style.display = 'block'
        let elBox = document.getElementById('lt-branch-box_' + id)
        let boxH = elBox.offsetHeight
        let animationH = elAnimation.offsetHeight
        elAnimation.style.overflowY = 'hidden'
        /* 发现将overflow设为hidden后，div里的内容和边框的距离会增加， 所以这里暂时将elBox的margin-top设为负值以抵消和边框距离的增加 */
        // elBox.style.marginTop = '-15px'

        let addHeight = boxH / 10 // -----每次增加或减小的高度
        if (this.control['lt-branch_' + id][0] === 'close' || this.control['lt-branch_' + id][0] === 0) { // ---执行展开动画
          elAnimation.style.height = (animationH + addHeight) + 'px'
          if (animationH > boxH || animationH === boxH) { // -------如果elAnimation的高大于elBox的高，把elAnimation的style设为animationOpenStyle，同时退出循环
            // elAnimation.style.cssText = this.animationOpenStyle
            if (parameter) {
              this.$emit('sendClickBranchIndex', id)
            }
            elBox.style.marginTop = ''
            this.setControl(id)
          } else if (this.control['lt-branch_' + id][0] === 'close' || this.control['lt-branch_' + id][0] === 0) { // ---执行闭合动画
            elAnimation.style.height = (animationH + addHeight) + 'px'
            setTimeout(() => {
              this.doAnimation(id, parameter)
            }, this.animationTime)
          }
        } else {
          if (animationH < addHeight || animationH === addHeight) { // -------如果elAnimation的高小于等于addHeight，把elAnimation的style设为animationCloseStyle，同时退出循环
            // elAnimation.style.cssText = this.animationCloseStyle
            if (parameter) {
              this.$emit('sendClickBranchIndex', id)
            }
            elBox.style.marginTop = ''
            this.setControl(id)
          } else {
            elAnimation.style.height = (animationH - addHeight) + 'px'
            setTimeout(() => {
              this.doAnimation(id, parameter)
            }, this.animationTime)
          }
        }
      }
    },
    doRotate (index, direction) { // --------------------图标旋转动画，direction等于1表示顺时针旋转，等于-1表示逆时针旋转
      let elIcon = document.getElementById('lt-branch-icon_' + index)
      if (elIcon && this.animation !== false && !isNaN(parseInt(this.getIcon(index)[1])) && this.control['lt-branch_' + index][0] !== 'always') {
        let transformIcon = elIcon.style.transform
        let translateY = ''
        let angle = 0
        if (transformIcon.indexOf('translateY(-50%)') > -1) translateY = 'translateY(-50%)'
        if (transformIcon.indexOf('rotate') > -1) {
          angle = parseInt(transformIcon.split('rotate(')[1].split('deg)')[0])
        }
        if (!direction) {
          if (this.control['lt-branch_' + index][0] === 'close' || this.control['lt-branch_' + index][0] === 0) {
            direction = 1
          } else if (this.control['lt-branch_' + index][0] === 'open' || this.control['lt-branch_' + index][0] === 1) {
            direction = -1
          }
        }

        let maxAngle = parseInt(this.getIcon(index)[1]) // -----图标旋转所能达到的最大角度，即展开的时候图标需要旋转的角度
        let rotateAngle = maxAngle / 10 // -----图标每次旋转的角度

        if (direction === 1) { // ---执行展开动画
          elIcon.style.transform = `${translateY} rotate(${angle + rotateAngle}deg)`
          if (parseInt(angle + rotateAngle) > maxAngle || parseInt(angle + rotateAngle) === maxAngle) { // -------如果elIcon旋转的角度大于等于maxAngle，把elIcon旋转的角度设为maxAngle，同时退出循环
            elIcon.style.transform = `${translateY} rotate(${maxAngle}deg)`
            return
          }
        } else {
          elIcon.style.transform = `${translateY} rotate(${angle - rotateAngle}deg)`
          if (parseInt(angle - rotateAngle) < 0 || parseInt(angle - rotateAngle) === 0) { // -------如果elIcon旋转的角度小于等于0，把elIcon旋转的角度设为0，同时退出循环（elIcon旋转的角度为0的时候即会到展开时图标的初始状态）
            elIcon.style.transform = `${translateY} rotate(0deg)`
            return
          }
        }

        setTimeout(() => {
          this.doRotate(index, direction)
        }, this.animationTime)
      }
    }
  },
  computed: {
    branchIconBgStyle () { // ----图标背景层距离左边的距离，控制图标的位置
      return `left: ${this.indent * this.depth}px;`
    },
    branchOpenStyle () { // ---branch展开时的样式
      return `padding-left: ${this.indent * this.depth + this.spacing}px;`
    },
    branchCloseStyle () { // ---branch闭合时的样式
      return `padding-left: ${this.indent * this.depth + this.spacing}px;`
    },
    animationOpenStyle () {
      return `margin:0px;
              padding:0px;
              border:0px;`
    },
    animationCloseStyle () {
      return `margin:0px;
              padding:0px;
              border:0px;
              height:0px;
              display:none;`
    },
    boxStyle () {
      return ''
    }
  },
  created () {
    /*
    将类似于下面 control 的值赋给data中的control，这样的话，就可通过this.control.branchLevel1[0]的值来控制分支branchLevel1的展开或闭合。其中branchLevel1中的1与每个分支中的data-index相同，这样每个分支在control中都有个对应的值来控制和判断它的状态。
    control: {
      lt-branch_1: ['close'],
      lt-branch_2: ['close'],
      lt-branch_3: ['close'],
    }
     */
    for (let n = 1; n < this.listData.length + 1; n++) {
      this.$set(this.control, 'lt-branch_' + (this.branchLevel + n), ['close']) // ----------默认情况，所有branch都为闭合状态(数组第一个元素表示branch的展开或闭合状态['open'为展开，'close'为闭合]
      this.$set(this.control, 'lt-branch-icon_' + (this.branchLevel + n), 'show') // ----------默认情况，所有icon都为显示状态('show'为显示，'hidden'为隐藏)

      if (this.open === 1) {
        this.$set(this.control, 'lt-branch_' + (this.branchLevel + n), ['open']) // ----------当open值为1时，所有branch都为展开状态
      } else if (typeof this.open === 'object') {
        /* 当open为数组时，根据当前分支所处级别以及open中与该级别对应的元素来确定当前分支是“open”、“close”还是“always”状态。其中一级分支状态对应open第一个元素值， 二级分支状态对应open第二个元素值，以此类推。如果open长度不够，那当前级别的分支状态对应open最后一个元素的值 */
        if (this.open.length > this.depth + 1 || this.open.length === this.depth + 1) {
          this.$set(this.control, 'lt-branch_' + (this.branchLevel + n), [this.open[this.depth]])
        } else {
          this.$set(this.control, 'lt-branch_' + (this.branchLevel + n), [this.open[this.open.length - 1]])
        }
      }
      if (this.openOnly === 1 && this.control['lt-branch_' + (this.branchLevel + n)][0] !== 'always') {
        this.$set(this.control, 'lt-branch_' + (this.branchLevel + n), ['close'])
      }
    }
  }
}
</script>
<style>
@import url("./icon/iconfont.css");

.iconfont {
    font-family:"iconfont" !important;
    font-style:normal;
    font-weight: normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
}
.lt-branch-icon-Bg{
  width: 20px;
  height: 20px;
  position: absolute;
  transform:translateY(-50%);
  top: 50%;
  left: 0;
}
</style>
