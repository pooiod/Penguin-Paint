document.querySelector('#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_body-wrapper_-N0sA.box_box_2jjDp.sa-stage-hidden > div > div.gui_editor-wrapper_2DYcj.box_box_2jjDp > div.backpack_backpack-container_2_wGr').style.display = 'block';
document.querySelector("#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_body-wrapper_-N0sA.box_box_2jjDp.sa-stage-hidden > div > div.gui_editor-wrapper_2DYcj.box_box_2jjDp > div.backpack_backpack-container_2_wGr > div").style.margin = "0px";
var targetElement = document.querySelector('#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_body-wrapper_-N0sA.box_box_2jjDp.sa-stage-hidden > div > div.gui_editor-wrapper_2DYcj.box_box_2jjDp');
if (targetElement) {
    targetElement.style.transform = 'scaleY(-1)';
    const children = targetElement.children;
    for (let child of children) {
        child.style.transform = 'scaleY(-1)';
    }
    if (document.querySelector('#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_menu-bar-position_3U1T0.menu-bar_menu-bar_JcuHF.box_box_2jjDp > div.menu-bar_main-menu_3wjWH > div.menu-bar_file-group_1_CHX > div:nth-child(2)')) {
        setTimeout(function(){
            document.querySelector('#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_menu-bar-position_3U1T0.menu-bar_menu-bar_JcuHF.box_box_2jjDp > div.menu-bar_main-menu_3wjWH > div.menu-bar_file-group_1_CHX > div:nth-child(2)').style.paddingBottom = "7px";
            document.querySelector('#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_menu-bar-position_3U1T0.menu-bar_menu-bar_JcuHF.box_box_2jjDp > div.menu-bar_main-menu_3wjWH > div.menu-bar_file-group_1_CHX > div:nth-child(2)').style.height = "20px";
            document.querySelector('#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_menu-bar-position_3U1T0.menu-bar_menu-bar_JcuHF.box_box_2jjDp > div.menu-bar_main-menu_3wjWH > div.menu-bar_file-group_1_CHX > div:nth-child(2)').style.paddingTop = "0px";
        }, 1000);
    }
} else {
    window.fatalError("Unable to load editor backpack");
}
