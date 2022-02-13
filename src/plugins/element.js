import { ElButton, ElForm, ElFormItem, ElInput, ElInputNumber, ElSelect, ElOption, ElUpload, ElRadio, ElDatePicker } from 'element-plus'
import { ElRow, ElCol, ElContainer, ElHeader, ElMain, ElFooter, ElAside, ElDivider, ElBreadcrumb, ElBreadcrumbItem, ElLink } from 'element-plus'
import { ElMenu, ElSubmenu, ElMenuItem, ElMenuItemGroup, ElDropdown, ElDropdownMenu, ElDropdownItem, ElPageHeader, ElSteps, ElStep } from 'element-plus'
import { ElIcon, ElImage, ElAvatar, ElConfigProvider, ElSpace, ElSwitch, ElSkeleton } from 'element-plus'
import { ElCard, ElTable, ElTableColumn, ElPagination, ElTabs, ElTabPane, ElAffix } from 'element-plus'
import { ElMessage, ElMessageBox, ElTooltip, ElDialog, ElTag, ElPopover, ElLoading } from "element-plus";

// 语言配置在App.vue中
export default (app) => {
  app.use(ElContainer)
  app.use(ElHeader)
  app.use(ElMain)
  app.use(ElFooter)
  app.use(ElAside)
  app.use(ElRow)
  app.use(ElCol)
  app.use(ElDivider)
  app.use(ElBreadcrumb)
  app.use(ElBreadcrumbItem)
  app.use(ElLink)

  app.use(ElMenu)
  app.use(ElSubmenu)
  app.use(ElMenuItem)
  app.use(ElMenuItemGroup)
  app.use(ElDropdown)
  app.use(ElDropdownMenu)
  app.use(ElDropdownItem)
  app.use(ElPageHeader)
  app.use(ElSteps)
  app.use(ElStep)

  app.use(ElButton)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)
  app.use(ElInputNumber)
  app.use(ElSelect)
  app.use(ElOption)
  app.use(ElUpload)
  app.use(ElRadio)
  app.use(ElDatePicker)

  app.use(ElIcon)
  app.use(ElImage)
  app.use(ElAvatar)
  app.use(ElConfigProvider)
  app.use(ElSpace)
  app.use(ElSwitch)
  app.use(ElSkeleton)

  app.use(ElCard)
  app.use(ElTable)
  app.use(ElTableColumn)
  app.use(ElPagination)
  app.use(ElTabs)
  app.use(ElTabPane)
  app.use(ElAffix)

  //消息提示
  app.config.globalProperties.$message = ElMessage
  //消息提示弹出框
  app.config.globalProperties.$messageBox = ElMessageBox
  //加载弹出框
  app.config.globalProperties.$loading = ElLoading
  // 文字提示
  app.use(ElTooltip)
  app.use(ElDialog)
  app.use(ElPopover)
  app.use(ElTag)
}
