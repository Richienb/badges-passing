// this import statement tells webpack to include styles.css in the build
import css from "./styles.css"

import $ from "jquery"

function init() {
    if (!window.addEventListener) return // Check for IE9+

    let options = INSTALL_OPTIONS

    let element

    const removeEmpty = (obj) => {
        const o = JSON.parse(JSON.stringify(obj)) // Clone source object.

        Object.keys(o).forEach((key) => {
            if (o[key] && typeof o[key] === "object")
            {o[key] = removeEmpty(o[key])} // Recurse.
            else if (o[key] === undefined || o[key] === null)
            {delete o[key]} // Delete undefined and null.
            else
            {o[key] = o[key]} // Copy value.
        })

        return o // Return new object.
    }

    // updateElement runs every time the options are updated.
    // Most of your code will end up inside this function.
    function updateElement() {
        options.badges.map((val) => {
            element = INSTALL.createElement(val.location, element)
            const url = (() => {
                let p = $.param(removeEmpty({
                    label: val.label,
                    color: val.colour.slice(1),
                    logo: val.logo || "",
                    style: options.style,
                    cacheSeconds: parseInt(options.cache),
                }))
                if (options.style === "social") p += `&link=${val.lefturl}&link=${val.righturl}`
                if (val.type === "static") {
                    const message = encodeURIComponent(val.message)
                    const label = encodeURIComponent(val.label)
                    return `https://img.shields.io/badge/${label}-${message}-${encodeURIComponent(val.colour)}.svg?${p}`
                }
                else if (val.type === "dynamic") {
                    const url = encodeURIComponent(val.dataurl)
                    const query = encodeURIComponent(val.dataquery)
                    return `https://img.shields.io/badge/dynamic/json.svg?${p}&url=${url}&query=${query}`
                }
            })()
            $(element).replaceWith($("<object>").attr({
                app: "cloudflare-badges-app",
                data: url,
                type: "image/svg+xml",
                alt: val.message,
            }))
        })
    }

    // INSTALL_SCOPE is an object that is used to handle option changes without refreshing the page.
    window.INSTALL_SCOPE = {
        setOptions(nextOptions) {
            options = nextOptions

            $("[app=\"cloudflare-badges-app\"]").remove()

            updateElement()
        },
    }

    // This code ensures that the app doesn't run before the page is loaded.
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", updateElement)
    } else {
        updateElement()
    }
}

init()
