const catchError = require('../utils/catchError');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const Review = require('../models/Review');
const Image = require('../models/Image');
const City = require('../models/City');

const getAll = catchError(async (req, res) => {
    const userId = req.user.id;
    const results = await Booking.findAll({
        include: [Hotel],
        where: { userId }
    });

    const bookingWithImageAndRating = await Promise.all(results.map(async (book) => {
        const bookJson = book.toJSON();
        const hotelId = bookJson.hotelId;
        const cityId = bookJson.hotel.cityId;
        const reviews = await Review.findAll({
            where: { hotelId }
        })

        const images = await Image.findAll({
            where: { hotelId }
        })

        const city = await City.findOne({
            where: { id : cityId }
        })

        let sum = 0;
        reviews.forEach(review => {
            sum += review.rating;
        })

        const totalReviews = reviews.length;
        const average = totalReviews > 0 ? sum / totalReviews : 0;
        const roundedAverage = parseFloat(average.toFixed(1));
        const hotelWithImages = {
            ...bookJson.hotel,
            images,
            city
        };

        return { ...bookJson, hotel:hotelWithImages, rating: roundedAverage }
    }));

    return res.json(bookingWithImageAndRating);
});

const create = catchError(async (req, res) => {
    const { checkIn, checkOut, hotelId } = req.body;
    const userId = req.user.id;
    const result = await Booking.create({
        userId,
        hotelId,
        checkIn,
        checkOut
    });
    return res.status(201).json(result);
});

const remove = catchError(async (req, res) => {
    const { id } = req.params;
    await Booking.destroy({ where: { id } });
    return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut } = req.body;
    const result = await Booking.update(
        { checkIn, checkOut },
        { where: { id }, returning: true }
    );
    if (result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

module.exports = {
    getAll,
    create,
    remove,
    update
}