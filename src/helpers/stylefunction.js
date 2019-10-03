export const checkBg = (idElements, classname) => {
    if (document.getElementById(idElements)) {
        document.body.classList.add(classname)
    } else {
        document.body.classList.remove(classname)
    }
}