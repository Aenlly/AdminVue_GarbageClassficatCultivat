import { ElButton, ElForm, ElFormItem, ElInput } from 'element-plus'
import { ElRow, ElCol, ElContainer, ElHeader, ElMain, ElFooter, ElAside, ElDivider } from 'element-plus'
import { ElMenu, ElSubmenu, ElMenuItem, ElMenuItemGroup, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { ElIcon, ElImage, ElAvatar } from 'element-plus'
// import lang from 'element-plus/lib/locale/lang/zh-cn'
// import locale from 'element-plus/lib/locale'

export default (app) => {
  // locale.use(lang)
  app.use(ElContainer)
  app.use(ElHeader)
  app.use(ElMain)
  app.use(ElFooter)
  app.use(ElAside)
  app.use(ElRow)
  app.use(ElCol)
  app.use(ElDivider)

  app.use(ElMenu)
  app.use(ElSubmenu)
  app.use(ElMenuItem)
  app.use(ElMenuItemGroup)
  app.use(ElDropdown)
  app.use(ElDropdownMenu)
  app.use(ElDropdownItem)

  app.use(ElButton)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)

  app.use(ElIcon)
  app.use(ElImage)
  app.use(ElAvatar)
}
