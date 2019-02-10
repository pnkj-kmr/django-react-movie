import React from 'react';
import ItemDetail from './Item';


class ListItem extends React.Component {

    constructor(props) {
        super(props)
        this.editItem = this.editItem.bind(this);
        this.onBackButtom = this.onBackButtom.bind(this);
        this.state = { 
            data: this.props.data,
            item: undefined
        }
        // console.log(">>>>>", this.state, this.props)
    }

    onBackButtom(e) {
        this.setState({ item: undefined });
        window.location.reload();
    }

    editItem(e) {
        // console.log(">>> edit clicked", e);
        this.setState({ item:e });
    }

    render() {
        // const alterColor = ['#d5d5d5', '#a9a9a9'];
        const { data, item } = this.state;
        const objList = data.map(obj => {
            return (
                <div className="item-div raw" id={obj.id}>
                    <table>
                        <tbody>
                        <tr>
                            <td id="img-div" rowSpan="4" className="pr-2">
                                { obj.image_url ?
                                    <img src={obj.image_url} alt="" width="100px" height="120px" />
                                :
                                    <img src={"/static/img/"+String(obj.id)+".jpeg"} alt="" width="100px" height="120px" />
                                }
                                {/* <img src={"/static/img/"+String(obj.id)+".jpeg"} alt="" width="100px" height="120px" /> */}
                            </td>
                            <td>
                                <strong><label className="text-primary">{obj.name}  </label></strong>
                                { obj.image_url ?
                                    <button className="btn-link" value={obj.id} ><i className="fa fa-info-circle"></i></button>
                                :
                                    <button className="btn-link" value={obj.id} onClick={() => this.editItem(obj.id)}><i className="fa fa-edit"></i></button>
                                }
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><strong>Description:</strong></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>{obj.description}</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><strong>Director: </strong> {obj.author}</td>
                            <td></td>
                            <td><strong>Created: </strong> {obj.creationdate}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            )
            });

        return (
            <div>
            {   item 
            ?
                <ItemDetail 
                    onBack={e => this.onBackButtom(e)} 
                    data={item}
                /> 
            :
                objList
            }
            </div>  
        );
    }
}

export default ListItem;
