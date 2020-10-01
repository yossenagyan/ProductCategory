import React, { Component } from 'react';
import {Text, Spinner, TouchableWithoutFeedback} from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';

import {Card, CardSection} from './common';
import ProductItem from './ProductItem';

class CategoryItem extends Component {
    state = {
        products: [],
        isLoading: false,
        hasProduct: false,
    }
    loadProduct() {
        const categoryId = this.props.category.id
        if ( !this.state.hasProduct) {
            this.setState({ isloading: true })
            axios.get(`https://simple-ecommerce-9999.herokuapp.com/api/v1/category/${categoryId}/product`)
            .then(response => {
                console.log(response.data.data.products);
                this.setState({ 
                    isloading: false,
                    hasProduct: true,
                    products: response.data.data.products })
            })
            .catch(error => {
                console.log(error.message);
            })
        }      
    }
    onCategoryPress() {
        const { id, name } = this.props.category
        console.log(this.props.category.name);
        this.props.dispatch({
            type: "SET_ACTIVE_CATEGORY",
            payload: id
        })
        this.loadProduct()
    }
    renderProductList() {
        if (this.state.isLoading) {
            return (
                <Card>
                    <CardSection>
                        <Spinner />
                    </CardSection>
                </Card>
            )
        }
        const currentCategoryId = this.props.category.id
        const activeCategory = this.props.activeCategory
        if (currentCategoryId == activeCategory) {       
             return this.state.products.map(item =>
                <ProductItem product = { item } key = { item.id }/>
                )
        }      
    }
    render() { 
        const { id, name } = this.props.category
        
        
        return ( 
            <> 
                <Card>
                    <CardSection>
                        <TouchableWithoutFeedback onPress={()=> this.onCategoryPress()}>
                            <Text> { name }</Text>
                        </TouchableWithoutFeedback>
                    </CardSection>
                </Card>
                { this.renderProductList() }
            </>
        );
    }
}

const mstp = (state) => {
    return {
        activeCategory: state.activeCategory
    }
}
 
export default connect(mstp)(CategoryItem);