/** @jsx React.DOM */
var MultiSelectItem = React.createClass({displayName: 'MultiSelectItem',
  getDefaultProps: function() {
    return {
      visible: true,
      selected: false,
      onClick: function() {}
    }
  },
  render: function() {
    return React.DOM.li({
      className: this.props.selected ? 'selected' : 'deselected', 
      onClick: this.props.onClick, 
      style: this.props.visible ? {} : {display: 'none'}
    }, this.props.text)
  }
})
var MultiSelect = React.createClass({displayName: 'MultiSelect',
  getDefaultProps: function() {
    return {
      items: [],
      placeholder: 'Enter some filter text',
      onChange: function() {},
      onItemSelected: function() {},
      onItemDeselected: function() {}
    }
  },
  getInitialState: function() {
    return {
      selections: {},
      filter: ''
    }
  },
  handleItemClick: function(item) {
    this.setSelected(item, !this.state.selections[item.id])
  },
  handleInputChange: function(event) {
    // Keep track of every change to the filter input
    this.setState({ filter: event.target.value })
  },
  createItem: function(item) {
    // Filter item visibility based on the filter input
    var regex = new RegExp('.*'+this.state.filter+'.*', 'i')
    return MultiSelectItem({
      key: item.id, 
      text: item.text, 
      onClick: this.handleItemClick.bind(this, item), 
      visible: regex.test(item.text), 
      selected: this.state.selections[item.id] ? true : false}
    )
  },
  selectAll: function(event) {
    this.setSelected(this.props.items, true)
  },
  selectNone: function(event) {
    this.setSelected(this.props.items, false)
  },
  setSelected: function(items, selected) {
    // Accept an array or a single item
    if (!(items instanceof Array)) items = [items]
    var selections = this.state.selections
    for (var i in items) {
      selections[items[i].id] = selected
      if (selected)
        this.props.onItemSelected(items[i])
      else
        this.props.onItemDeselected(items[i])
    }
    this.setState({ selections: selections })
    this.props.onChange(selections)
  },
  render: function() {
    return (
      React.DOM.div({className: "multiselect"}, 
        React.DOM.input({onChange: this.handleInputChange, value: this.state.filter, placeholder: this.props.placeholder}), 
        React.DOM.ul(null, this.props.items.map(this.createItem)), 
        React.DOM.button({onClick: this.selectAll}, "Select all"), " ", 
        React.DOM.button({onClick: this.selectNone}, "Select none")
      )
    )
  }
})
if (typeof module === 'undefined') {
  window.MultiSelect = MultiSelect
} else {
  module.exports = MultiSelect
}