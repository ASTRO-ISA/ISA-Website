const axios = require('axios')
exports.upcomingLaunches = async (req, res) => {
    try{
        const responce = await axios.get('https://lldev.thespacedevs.com/2.3.0/launches/upcoming/')
        res.json(responce.data.results)
    } catch (err) {
        res.status(500).json({message: 'Server error in upcomingLaunches'})
    }
}