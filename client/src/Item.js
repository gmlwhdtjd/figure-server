import React from 'react'; 
import PropTypes from 'prop-types'
import './Item.css';

function Item({brandName, itemId, itemImage, qrList}) {
    return(
        <div className="Item">
            <div className="Item__Column">
                <ItemImage itemImage={itemImage} alt={itemId}/> 
            </div>
            <div className="Item__Column">
                <h1> {brandName} </h1>  
                <h2> {itemId} </h2>
                <div className="Item__Sizes">
                    {Object.keys(qrList).map((key, index) => <ItemSize sizeName={key} key={index} />)}
                </div>
            </div>
        </div>
    )
}

function ItemSize({sizeName}) {
    return (
        <span className="Item__Size">{sizeName} </span>
    )
}

function ItemImage({itemImage, alt}) {
    return (
        <img className="Item__Image" src={"data:image/png;base64," + itemImage} title={alt} alt={alt}/> 
    )
}

Item.propTypes = {
    brandName: PropTypes.string.isRequired,
    itemId: PropTypes.string.isRequired,
    itemImage: PropTypes.string.isRequired,
    qrList: PropTypes.object.isRequired 
}

ItemSize.prototype = {
    sizeName: PropTypes.string.isRequired
}

ItemImage.propTypes = {
    itemImage : PropTypes.string.isRequired,
    alt : PropTypes.string.isRequired
}

export default Item;