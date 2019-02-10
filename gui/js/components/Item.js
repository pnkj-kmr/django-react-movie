import React from 'react';


class ItemDetail extends React.Component {

    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.insertUpdateData = this.insertUpdateData.bind(this);
        this.buildUrl = this.buildUrl.bind(this);
        // this.postData = this.postData.bind(this);
        let form = ""
        if (this.props.data > 0) {
            form = "Edit"
        } else {
            form = "Add"
        }
        this.state = { 
            form: form,
            mId: 0,
            mName: "",
            mDescr: "",
            mAuthor: "",
            ret_display: ""
        }
        const mId = this.props.data;
        if (mId === -1 || mId === undefined || mId === null) { } else {
            this.insertUpdateData("/api/m/"+mId+"/", {}, "GET")
        }
    }

    // componentDidMount() {
    //     let mId = this.props.data;
    //     console.log(">>> mId", mID);
    // }

    // postData(url, data) {
    //     // Default options are marked with *
    //       return fetch(url, {
    //           method: "POST", // *GET, POST, PUT, DELETE, etc.
    //           mode: "cors", // no-cors, cors, *same-origin
    //           cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //         //   credentials: "same-origin", // include, *same-origin, omit
    //           headers: {
    //               "Content-Type": "application/json",
    //               "Access-Control-Allow-Origin": "*",
    //               "x-frame-options": "SAMEORIGIN",
    //               "Vary": "Origin",
    //               // "Content-Type": "application/x-www-form-urlencoded",
    //           },
    //           redirect: "follow", // manual, *follow, error
    //           referrer: "no-referrer", // no-referrer, *client
    //           body: JSON.stringify(data), // body data type must match "Content-Type" header
    //       })
    //       .then(response => response.json()); // parses response to JSON
    //   }

    buildUrl(url, parameters) {
        let qs = "";
        for (const key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                const value = parameters[key];
                qs += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
            }
        }
        if (qs.length > 0) {
            qs = qs.substring(0, qs.length - 1);
            url = url + "?" + qs;
        }
        return url;
    }

    insertUpdateData(uri, params, method){
        // console.log(`uri, params, method`, uri, params, method);
        let endpoint = '/api/m/'
        if (uri !== undefined) {
            endpoint = uri
        }
        if (params === undefined) {
            params = {}
        }
        let result_display = "Movie updated successfully.";
        if (method === undefined) {
            method = "GET";
            result_display = "Movie added successfully.";
        }
        // let api_url = window.location.origin + endpoint;
        // console.log(`url >> `, api_url);
        // this.postData(api_url, params)
        // var data = new FormData();
        // data.append("form_obj", JSON.stringify(params));

        let thisComp = this;
        let lookupOptions = {
            method: method,
            credentials: "same-origin",
            headers: {
                'Content-Type': 'application/json'
            },
        }
        endpoint = this.buildUrl(endpoint, params);
        // console.log("data>>>", lookupOptions, endpoint);
        fetch(endpoint, lookupOptions)
            .then(function (response) {
                return response.json()
            }).then(function (responseData) {
                // console.log(`response data >> `,responseData);
                if (responseData.data) {
                    if (endpoint.startsWith("/api/m/submit/")) {
                        thisComp.setState({ 
                            ret_display: result_display
                        });
                    }
                    let data = responseData.data;
                    if (data.length == 1) {
                        data = data[0]
                        thisComp.setState({
                            mId: data.id,
                            mName: data.name,
                            mDescr: data.description,
                            mAuthor: data.author
                        });
                    }
                } else {
                    thisComp.setState({
                        ret_display: "Unable to perform action. Please try again."
                    });
                }
            }).catch(function (error) {
                thisComp.setState({
                    ret_display: "Unable to perform action. Please try again."
                });
                console.log("Fetch Error >>> ", error);
            })
    }

    handleSubmit(e) {
        if (e) { e.preventDefault(); }
        if (this.state.mName === "" || this.state.mName === undefined) {
            alert("Please fill Movie name.")
            return;
        }
        let endpoint = "/api/m/submit/";
        let method = "GET";
        // let endpoint = "/api/m/";
        // let method = "POST";
        // if (this.state.mId !== 0) {
        //     method = "PUT";
        //     endpoint = "/api/m/" + this.state.mId + "/";
        // }
        let fields = { 
            id: this.state.mId,
            name: this.state.mName,
            descr: this.state.mDescr,
            author: this.state.mAuthor, 
        }
        // console.log(">> fields", fields);
        this.insertUpdateData(endpoint, fields, method)
        // this.props.onBack();
        this.setState({
            mId: 0,
            mName: "",
            mDescr: "",
            mAuthor: ""
        })
    }

    handleReset(e) {
        if (e) { e.preventDefault(); }
        this.formCreate.reset();
        this.props.onBack();
        this.state = { 
            mId: 0,
            mName: "",
            mDescr: "",
            mAuthor: "",
            ret_display: "",
        }
    }


    render() {
        const { form } = this.state;
        return (
            <form id="lg-form" className="my-0" ref={(el) => this.formCreate = el}>
                <div className="messages">{form} Movie Detail</div>
                <div className="controls">
                    <div className="row px-3">
                        <div className="col-lg-3 col-md-6 col-sm-12 px-0 mr-3">
                            <div className="form-group">
                                <label htmlFor="mName">Movie Name *</label>
                                <input type="text"
                                    name="mName"
                                    value={this.state.mName}
                                    onChange={e => this.setState({ mName: e.target.value })}
                                    className="form-control"
                                    placeholder="--Name--"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row px-3">
                        <div className="col-lg-3 col-md-6 col-sm-12 px-0 mr-3">
                            <div className="form-group">
                                <label htmlFor="mDescr">Movie Description</label>
                                <input type="text"
                                    name="mDescr"
                                    value={this.state.mDescr}
                                    onChange={e => this.setState({ mDescr: e.target.value })}
                                    className="form-control"
                                    placeholder="--Decription--"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row px-3">
                        <div className="col-lg-3 col-md-6 col-sm-12 px-0 mr-3">
                            <div className="form-group">
                                <label htmlFor="mAuthor">Director</label>
                                <input type="text"
                                    name="mAuthor"
                                    value={this.state.mAuthor}
                                    onChange={e => this.setState({ mAuthor: e.target.value })}
                                    className="form-control"
                                    placeholder="--Director Name--"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row px-3">
                        <div className="col-lg-3 col-md-6 col-sm-12 px-0">
                            { this.state.ret_display ? <label>{this.state.ret_display}</label>: ""}
                            <div className="form-group">
                                <input className="btn btn-success btn-send" onClick={this.handleSubmit} type="submit" value={form} />&nbsp;&nbsp;
                                <button className="btn btn-secondary" onClick={this.handleReset}>Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

export default ItemDetail;


