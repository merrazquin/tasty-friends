export default {
    convertTimeto24Hour: function (time) {
        const AMPM = time.slice(-2)
        let hours = parseInt(time.slice(0, 2), 10),
            minutes = parseInt(time.slice(3, 5), 10)
        if (AMPM === "PM" && hours < 12) hours += 12
        if (AMPM === "AM" && hours === 12) hours -= 12

        let sHours = hours.toString(),
            sMinutes = minutes.toString()

        if (hours < 10) sHours = "0" + sHours
        if (minutes < 10) sMinutes = "0" + sMinutes

        return { hours, minutes, string: sHours + ":" + sMinutes }
    }
}