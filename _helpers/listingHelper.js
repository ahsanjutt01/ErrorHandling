const Listing = require('../models/listing');
const User = require('../models/user');
exports.createListing = (
    user,
    title,
    desciption,
    isFree,
    price,
    date,
    isWillingToPayShipingCharges,
    isWillingToMeet,
    state,
    isActiveListing,
    condition,
    imageUrls,
    catagoryId
) => {
    return user.createListing({
        title: title,
        desciption: desciption,
        isFree: isFree,
        price: price,
        date: date,
        isWillingToPayShipingCharges: isWillingToPayShipingCharges,
        isWillingToMeet: isWillingToMeet,
        state: state,
        isActiveListing: isActiveListing,
        condition: condition,
        catagoryId: catagoryId,
        isActive: true
    }).then( listing => {
        if(imageUrls.length > 0) {
            imageUrls.forEach(element => {
                listing.createListingImage({url: element.url, isActive: true});
            });
        }
            return listing;
    }).catch(err => console.log('ERROR =========================== ',err));
}

exports.updateListing  = (
    id,
    title,
    desciption,
    isFree,
    price,
    date,
    isWillingToPayShipingCharges,
    isWillingToMeet,
    state,
    isActiveListing,
    condition,
    catagoryId
) => {
    return Listing.findOne({where: {id: id, isActive: true}}).then(listing => {
        listing.title = title;
        listing.description = desciption;
        listing.isFree = isFree;
        listing.price = price;
        listing.date = listing.date;
        listing.isWillingToPayShipingCharges = isWillingToPayShipingCharges;
        listing.isWillingToMeet = isWillingToMeet;
        listing.state = state;
        listing.isActiveListing = isActiveListing;
        listing.condition = condition;
        listing.catagoryId = catagoryId;
        return listing.save();
    }).catch(err => console.log(err));
}

exports.getAllListing = (user) => {
    return user.getListings({where: {isActive: true}, include: ['listingImages']});
    // return user.getListings({where: {isActive: true}, include: [{ all: true, nested: true }]});
}

exports.findOne = (id, user) => {
    return user.getListings({where: {id: id, isActive: true}, include: ['listingImages']});
}