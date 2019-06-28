// this import statement tells webpack to include styles.css in the build
import css from "./styles.css"

import $ from "jquery"

function init() {
    if (!window.addEventListener) return // Check for IE9+

    let options = INSTALL_OPTIONS

    let element

    // updateElement runs every time the options are updated.
    // Most of your code will end up inside this function.
    function updateElement() {
        options.static.map((val) => {
            element = INSTALL.createElement(val.location, element)
            const url = (() => {
                let o = `https://img.shields.io/badge/${encodeURIComponent(val.label)}-${encodeURIComponent(val.message)}-${encodeURIComponent(val.colour.slice(1))}.svg?style=${options.style}&cacheSeconds=${parseInt(options.cache)}`
                if (options.style === "social") {
                    o += `&link=${val.lefturl}&link=${val.righturl}`
                }
                return o
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
