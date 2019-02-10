import React from 'react';

class SearchForm extends React.Component {

    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.state = { searchValue: "" }
    }

    handleSubmit(e) {
        if (e) { e.preventDefault(); }
        let searchValue = this.state.searchValue;
        // let data = this.state
        // let pros = this.props
        // console.log(`data -->`, data, pros, e);
        let fields = { searchValue: searchValue }
        this.props.onFormSubmit(fields);
        this.setState({ searchValue: searchValue });
    }

    handleReset(e) {
        if (e) { e.preventDefault(); }
        this.formCreate.reset();
        let fields = { searchValue: "" }
        this.props.onFormRest(fields);
        this.setState({ searchValue: "" });
    }


    render() {
        return (
            <form id="lg-form" className="my-0" ref={(el) => this.formCreate = el}>
                <div className="messages"></div>
                <div className="controls">
                    <div className="row px-3">
                        <div className="col-lg-3 col-md-6 col-sm-12 px-0 mr-3">
                            <div className="form-group">
                                <input type="text"
                                    name="searchValue"
                                    onChange={e => this.setState({ searchValue: e.target.value })}
                                    className="form-control"
                                    placeholder="--SEARCH--"
                                />
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12 px-0">
                            <div className="form-group">
                                <input className="btn btn-success btn-send" onClick={this.handleSubmit} type="submit" value="Search" />&nbsp;&nbsp;
                                <button className="btn btn-secondary" onClick={this.handleReset}>Clear</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

export default SearchForm;
