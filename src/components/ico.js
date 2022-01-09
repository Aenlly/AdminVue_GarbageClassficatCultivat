import * as icons from '@element-plus/icons'

export default (app) => {
    /**循环引入所有图标 */
    Object.keys(icons).forEach(key => {
        app.component(key, icons[key])
    })
}