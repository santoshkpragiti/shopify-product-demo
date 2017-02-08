import React, { Component } from 'react';
import './App.css';

import shopClient from './shopClient'
import ProductItem from './ProductItem'
import loader from './download.gif'

class App extends Component {
  /**
   * constructor
   * Inital Constructor to get the inital state and
   * usually different functions are bind to this within this constructor
   */
  constructor () {
    super()

    this.state = {
      product: {},
      error: false,
      loading: false,
      completed: false,
      quantity: 1
    }

    this.shopClient   =  shopClient
    this.fetchProduct = this.fetchProduct.bind(this)
    this.setOption    = this.setOption.bind(this)
    this.setVariant = this.setVariant.bind(this)
  }

  componentDidMount () {
    this.fetchProduct(8566905489)
  }

  /**
   * fetchProduct
   * fetches the product
   */
  async fetchProduct (productId) {
    try {
      this.setState({
        loading: true
      })

      const product = await shopClient.fetchProduct(productId)
      this.setState({
        loading: false,
        completed: true
      })
      this.setVariant.bind(this)(product)
      this.product = product
    } catch (error) {
      this.setState({
        loading: false,
        error: true
      })
    }   
  }

  /**
   * setOption
   * sets the option
   */
  async setOption (index, name, value) {
    const { product } = this   

    // Return if the product here is undefined
    if (!product) {
      return
    }

    const option = product.options[index]
    option.selected = value

    this.setVariant(this.product)
  }

  /**
   * setVariant
   */
  async setVariant(product) {
    const { selectedVariant = {}, selectedVariantImage = {}} = product
    const checkoutUrl = selectedVariant && selectedVariant.checkoutUrl(this.state.quantity)
    let exists

    /**
     * productOptions
     * all the options are normalized
     */

    if (!product.options) {
      product.options = []
    }

    const productOptions = product.options.map((option) => {
      return {
        name: option.name,
        values: option.values,
        selected: option.selected
      }
    })

    if (!selectedVariant) {
      exists = false
    } else {
      exists = true
    }

    this.setState({
      product: {
        productTitle: product.title,
        productId: product.id,
        id: selectedVariant && selectedVariant.id,
        title: selectedVariant && selectedVariant.title,
        image: {
          src: selectedVariantImage && selectedVariantImage.src 
        },
        images: product.images,
        options: productOptions,
        variantOptions: selectedVariant && selectedVariant.optionValues,
        grams: selectedVariant && selectedVariant.grams,
        available: selectedVariant && selectedVariant.available,
        description: product.description,
        exists,
        selections: product.selections
      },
      checkoutUrl
    })
  }
  
  /**
   * changeQuantity
   * function which changes the quantity number within the product
   */
   changeQuantity (quantity = 1) {
    const { product } = this
    const selectedVariant = product.selectedVariant
    const checkoutUrl = selectedVariant && selectedVariant.checkoutUrl(quantity)

    console.log(quantity, checkoutUrl)
    this.setState({
      quantity,
      checkoutUrl
    })
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="App">
          <div className="App-loader">
            <img src={loader} alt="Product loading please wait" />
          </div>
        </div>
      )
    }

    return (
      <div className="App">
        <ProductItem product={this.state.product}
                     onSelect={this.setOption.bind(this)}
                     checkoutUrl={this.state.checkoutUrl}
                     onChangeQuantity={this.changeQuantity.bind(this)} />
      </div>
    );
  }
}

export default App;