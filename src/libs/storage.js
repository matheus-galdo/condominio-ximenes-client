let storage = {

    setItem: (key, value) => {
        if (typeof value === 'object' ) value = JSON.stringify(value)
        localStorage.setItem(key, value)
    },

    getItem: (key) => {
        let item = localStorage.getItem(key)
        
        try {
            item = JSON.parse(item)
        } catch (error) {
            return false
        } 

        return item
    },

    removeItem: (key) => {
        if (localStorage.getItem(key)) return false
        localStorage.removeItem(key)
        return true
    }
}

export default storage