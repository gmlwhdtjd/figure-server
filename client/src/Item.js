import React from 'react'; 
import PropTypes from 'prop-types'
import Popup from 'react-popup';
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
                    {Object.keys(qrList).map((key, index) => <ItemSize qrList={qrList} sizeName={key} key={index} />)}
                </div>
            </div>
        </div>
    )
}

function ItemSize({qrList, sizeName}) {
    return (
        <span className="Item__Size" 
            onClick={e =>{
                Popup.create({
                    title: sizeName,
                    content:  <ItemQR qrList={qrList} sizeName={sizeName}/>,
                    className: 'alert',
                  }, true);
            }}>
            {sizeName} 
        </span>
    )
}

function ItemQR({qrList, sizeName}) {
    return (
        <img className="Item__QR" src={"data:image/png;base64," + qrList[sizeName]} title={sizeName} alt={sizeName}/>
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
    qrList: PropTypes.object.isRequired,
    sizeName: PropTypes.string.isRequired
}

ItemImage.propTypes = {
    itemImage : PropTypes.string.isRequired,
    alt : PropTypes.string.isRequired
}

export default Item;