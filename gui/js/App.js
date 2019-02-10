import React from 'react';
import SearchForm from './components/Search';
import ListItem from './components/List';
import ItemDetail from './components/Item';


class Layout extends React.Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onBackButtom = this.onBackButtom.bind(this);
        this.buildUrl = this.buildUrl.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.addItem = this.addItem.bind(this);
        this.state = {
            fields: {},
            result: [],
            // result: [
            //     { id: 1, name: "TEST" },
            //     { id: 2, name: "TEST2" },
            //     { id: 3, name: "TEST3" },
            //     { id: 4, name: "TEST4" }
            // ],
            item: undefined,
        };
    }

    fetchData(uri, params, method){
        // console.log(`uri, params, method`, uri, params, method);
        let endpoint = '/api/m/'
        if (uri !== undefined) {
            endpoint = uri
        }
        if (params === undefined) {
            params = {}
        }
        if (method === undefined) {
            method = "GET"
        }
        endpoint = this.buildUrl(endpoint, params);
        // console.log(`url >> `, endpoint);
        let thisComp = this;
        let lookupOptions = {
            method: method,
            credentials: "same-origin",
            headers: {
                'Content-Type': 'application/json'
            }
        }

        fetch(endpoint, lookupOptions)
            .then(function (response) {
                return response.json()
            }).then(function (responseData) {
                // console.log(`response data >> `,responseData);
                if (responseData) {
                    thisComp.setState({
                        result: responseData.data
                    });
                } else {
                    console.log("Unable to fetch result. Please try again");
                }
            }).catch(function (error) {
                console.log("Fetch Error >>> ", error);
            })
    }

    componentDidMount() {
        this.fetchData();
    }

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

    onSubmit(fields) {
        // console.log(`fileds -->`, fields);
        let searchValue = fields.searchValue;
        if (searchValue === undefined || searchValue === null || searchValue === "") {
            console.log("Data fetch skipped", searchValue);
            return;
        }
        this.setState({
            fields,
            result: []
        });
        this.fetchData('/api/m/search/', fields);
    }

    onReset(fields) {
        // console.log(">>> Reset <<<", fields);
        this.setState({
            fields,
            result: []
        });
        this.fetchData('/api/m/search/', fields);
    }

    onBackButtom(e) {
        this.setState({ item: undefined });
        window.location.reload(); 
    }

    addItem(e) {
        this.setState({ item:-1 });
    }

    render() {
        const { result } = this.state;
        const { item } = this.state;

        return (
            <div>
                <div className="container mx-0 px-3" id="container-first">
                    <div className="row mx-0 px-0">
                        <div className="col-xl-12 col-lg-12 col-md-12">
                        {   item 
                        ?
                            <ItemDetail 
                                onBack={e => this.onBackButtom(e)}
                                data={item}
                            /> 
                        :
                            <div>
                                <SearchForm onFormSubmit={fields => this.onSubmit(fields)} onFormRest={e => this.onReset(e)} /> 
                                {/* <button className="btn btn-primary" onClick={this.addItem}>Add</button> */}
                                <button className="btn-link" onClick={this.addItem}><i className="fa fa-plus"></i> Add Movie</button>
                            </div>
                        }
                            {/* <SearchForm onFormSubmit={fields => this.onSubmit(fields)} onFormRest={e => this.onReset(e)} /> */}
                        </div>
                    </div>
                    <div className="row mx-0 px-0">
                        <div className="col-xl-12 col-lg-12 col-md-12">
                            {/* <label className="my-0" htmlFor="query-result">Add Button</label> */}
                            { result.length > 0 ? 
                            <div className="mb-4 mt-1" id="query-result">
                                <ListItem data={result} />
                            </div> :
                            <div>No Data Available</div> }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Layout;
