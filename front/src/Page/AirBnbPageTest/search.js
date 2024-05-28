const express = require('express')
const router = express.Router()
const data = require('../database/data3.json')
const { checkSidinSessionDB } = require('../models/userData')

const getMonthDayFormat = (date) => {
    if (!date) return null
    const [year, month, day] = date.split('-')
    return `${+month}월 ${+day}일`
}

const getNextDay = (date) => {
    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate()+1)
    const month = nextDay.getMonth()+1
    const day = nextDay.getDate()
    return `2020-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`
}

router.get('/', async (req, res) => {
    const sid = req.cookies.sid
    const validSid = await checkSidinSessionDB(sid)

    const keyword = req.query
    const { location, checkin, checkout, adults, children=0 } = keyword
    const guest = (adults || children) ? +adults + +children : 0

    const result = data.filter((value)=> {
        const { place, maxGuest } = value
        if (guest < maxGuest+1) {
            if (place.includes(location) || location.includes(place)) return true
        }
        return false
    })

    const checkinDate = getMonthDayFormat(checkin)
    const checkoutDate = checkout ? getMonthDayFormat(checkout) : getMonthDayFormat(getNextDay(checkin))

    res.render('search', {
        isLoggedIn:validSid, 
        data: result, location,
        length: result.length,
        checkin: checkinDate,
        checkout: checkoutDate,
        guest
    })
})

router.get('/accommodation', (req, res) => {
    const { id } = req.query
    return res.json(data[id])
})

module.exports = router