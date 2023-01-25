export default class util {
    /**
     * @param {string} dataURL
     * @returns {Promise<string>} the image id
     */
    static async uploadImg(dataURL, barElement) {
        let i = 0, id

        if (barElement) barreifica(i)

        if (dataURL.length <= 50000) {
            await fetch("/api/img/single", {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    base64: dataURL,
                    completed: true,
                })
            }).then(async res => id = await res.text())
        } else {
            await fetch("/api/img", {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    base64: dataURL.slice(0, 50000),
                    completed: false,
                })
            }).then(async res => id = await res.text())

            for (i = 50000; i <= dataURL.length; i += 50000) {
                await fetch(`/api/img/${id}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json; charset=UTF-8" },
                    body: JSON.stringify({
                        base64: dataURL.slice(i, i + 50000),
                        completed: !(i + 50000 < dataURL.length),
                    })
                })
                if (barElement) barreifica(i)
            }
        }
        return id

        function barreifica(index) {
            let size = 10

            const percentage = index / dataURL.length
            const progress = Math.round((size * percentage))
            const emptyProgress = size - progress
            const progressText = '▇'.repeat(progress)
            const emptyProgressText = '—'.repeat(emptyProgress)
            const bar = progressText + emptyProgressText
            let percentageText = Math.round(percentage * 100)

            if (!percentageText) percentageText = 0

            barElement.innerText = `[ ${bar} ] ${percentageText}%`
        }
    }
    /**
     * @param {string} id imgId
     * @returns {Promise<string> | null} `dataURL` **OR** `null` if not found
     */
    static async getImg(id) {
        const img = { id: id, base64: "", completed: false }

        for (let i = 0; !img.completed; i += 100000) {
            let status = await fetch(`/api/img/${id}/${i}`, { method: "GET" }).then(async res => {
                if (res.ok) {
                    let body = await res.json()
                    img.base64 += body.base64
                    if (body.completed) {
                        img.completed = true
                    }
                } else return 404
            })
            if (status == 404) break
        }

        if (img.completed) {
            return img.base64
        } else return null
    }
    /**
     * @param {string} username
     * @param {string} pass
     */
    static enviarLogin(username, pass) {
        return fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                username: username,
                pass: pass,
            }),
        })
    }
    /**
     * @param {{username: string, pass: string, picture?: string}} info
     */
    static async criarConta(info) {
        let resposta

        await fetch(`/api/account/validate/${info.username}`, { method: 'GET' }).then(async (res) => {
            if (res.ok) resposta = await res.text()
            else resposta = false
        })

        switch (resposta) {
            case false:
                await fetch("/api/login/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json; charset=UTF-8" },
                    body: JSON.stringify(info),
                }).then(async (res) => {
                    if (res.ok) {
                        util.save(await res.json())
                        window.location.href = "../pages/account.html"
                    }
                })
                break
            case "username":
                window.alert("username usado")
                break
        }
    }
    /**
     * @param {string} src dataURL
     * @returns {Promise<HTMLImageElement>} loaded image
     */
    static async loadImage(src) {
        return new Promise((resolve) => {
            const img = document.createElement("img")
            img.src = src
            img.complete ? resolve(img) : img.addEventListener("load", () => {
                resolve(img)
            })
        })
    }
    /**
     * @param {string} src
     * @param {number} maxWidth
     * @returns {Promise<HTMLImageElement>} resized image
     */
    static async resizeImage(src, maxWidth) {
        const image = await util.loadImage(src)
        if (image.width > maxWidth) {
            let canvas = document.createElement("canvas")
            let opt = { width: maxWidth }

            if (opt.width && !opt.height) {
                opt.height = image.height * (opt.width / image.width)
            } else if (!opt.width && opt.height) {
                opt.width = image.width * (opt.height / image.height)
            }

            Object.assign(canvas, opt).getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height)
            return util.loadImage(canvas.toDataURL())
        } else return image
    }
    /**
     * @param {string} url dataURL
     * @param {number} maxWidth new img size
     * @param {number} ratio aspect ratio (1, 16/9)
     * @returns {Promise<string>} the resulting image as dataURL
     */
    static async cropImage(url, maxWidth = 720, ratio = 1) {
        return new Promise(async (resolve) => {
            const inputImage = await util.resizeImage(url, maxWidth)
            const inputWidth = inputImage.naturalWidth
            const inputHeight = inputImage.naturalHeight
            const inputImageAspectRatio = inputWidth / inputHeight

            let outputWidth = inputWidth
            let outputHeight = inputHeight
            if (inputImageAspectRatio > ratio) {
                outputWidth = inputHeight * ratio
            } else if (inputImageAspectRatio < ratio) {
                outputHeight = inputWidth / ratio
            }

            const outputX = (outputWidth - inputWidth) * 0.5
            const outputY = (outputHeight - inputHeight) * 0.5

            const outputImage = document.createElement("canvas")

            outputImage.width = outputWidth
            outputImage.height = outputHeight

            outputImage.getContext("2d").drawImage(inputImage, outputX, outputY)
            resolve(outputImage.toDataURL("image/png", 0.5))
        })
    }

    static validatePassword(pass, passConfirm) {
        if (passConfirm) {
            if (pass != passConfirm) return "senhasDiferentes"
        }
        if (pass.length < 5) return "senhaCurta"

        return true
    }

    static validateUsername(username) {
        if (username.length < 5) return "usernameCurto"
        else if (username.length > 20) return "usernameLongo"
        else return true
    }

    static errorMessage(errorType) {
        let message

        switch (errorType) {
            case "usernameCurto":
                message = "O nome de usuário deve ter pelo menos 5 caracteres."
                break
            case "usernameLongo":
                message = "O nome de usuário deve ter no máximo 20 caracteres."
                break
            case "username já existe":
                message = "Email ou Username já existem."
                break
            case "senhasDiferentes":
                message = "As senhas devem ser iguais."
                break
            case "senhaCurta":
                message = "A senha deve ter pelo menos 5 caracteres."
                break
            case "muitoNovo":
                message = "Você deve ter pelo menos 15 anos para criar uma conta."
                break
            case "dataInvalida":
                message = "Digite uma data válida."
                break
            case "camposVazios":
                message = "Preencha todos os campos corretamente"
                break;
            default:
                message = "Você achou um erro no site! Por favor nos informe dele para que possamos corrigi-lo!"
                break
        }

        if (!document.querySelector("body div#errorMessage")) {
            const messageBox = document.createElement("div")
            messageBox.id = "errorMessage"
            messageBox.className = "popup"
            messageBox.style.display = "flex"
            messageBox.addEventListener("click", e => {
                e.target.style.display = e.target.style.display == "flex" ? "none" : "flex"
            })
            document.querySelector("main").appendChild(messageBox)

            messageBox.innerText = message
        } else {
            let display = document.querySelector("div#errorMessage").style.display
            document.querySelector("div#errorMessage").style.display = display == "none" ? "flex" : "none"
            document.querySelector("div#errorMessage").innerText = message
        }
    }

    static save(body) {
        for (const key in body) {
            localStorage.setItem(key, body[key])
        }
    }

    static async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}

Object.assign(String.prototype, {
    cap() {
        return this.charAt(0).toUpperCase() + this.slice(1)
    },
    uncap() {
        return this.charAt(0).toLowerCase() + this.slice(1)
    }
})

Object.assign(Array.prototype, {
    shuffle() {
        let newArr = [...this]
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]]
        }
        return newArr
    }
})