import React, {Fragment, Component} from 'react';
import {
  View,
  Dimensions,
} from 'react-native';
import { DualScreenInfo } from 'react-native-dualscreeninfo'
import {Orientation, PanePriority, PaneMode} from "./types"

type Props = {
} & Partial<DefaultProps>;

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = { panePriority: PanePriority.Pane1,
  panePriorityVerticalSpanning: Orientation.Horizontal,
  paneMode: PaneMode.Auto
}

type State = {
  dims: any,
  spanning: boolean,
  panePriority?: string,
  panePriorityVerticalSpanning?: string,
  paneMode?: string,
};

export class TwoPaneView extends Component<Props, State> {
  state: State = {
    dims: Dimensions.get('window'),
    spanning: DualScreenInfo.isSpanning,
    panePriority: this.props.panePriority,
    panePriorityVerticalSpanning: this.props.panePriorityVerticalSpanning,
    paneMode: this.props.paneMode,
  };

  componentDidMount() {
    Dimensions.addEventListener('change', this._handleDimensionsChange);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this._handleDimensionsChange);
  }

  _handleDimensionsChange = (dimensions: { window: any; }) => {
    this.setState({
      dims: dimensions.window,
      spanning: DualScreenInfo.isSpanning
    });
  };

  render() {

    let direction:any ='row';

    return (
      <View style={{flexDirection: direction, width: this.state.dims.width, height:this.state.dims.height}}>
        {this.renderChildPanes()}
      </View>
    );
  }

  renderChildPanes() {
    const children = React.Children.toArray(this.props.children);

    if (this.state.spanning) {
      if (this.state.paneMode === PaneMode.Single ||
        this.state.dims.height > this.state.dims.width  && this.state.panePriorityVerticalSpanning) {
        if (this.state.panePriorityVerticalSpanning === PanePriority.Pane1) {
          return this.renderPane1(this.getEntireSize());
        }
        else {
          return this.renderPane2(this.getEntireSize());
        }
      }
      return this.renderBothPanes();
    }
    if (this.state.paneMode === PaneMode.Dual) {
      return this.renderDualPanes();
    }
    if (this.state.panePriority === PanePriority.Pane1) {
      return this.renderPane1(this.getEntireSize());
    }
    return this.renderPane2(this.getEntireSize());
  }

  renderDualPanes() {
    const children = React.Children.toArray(this.props.children);

    const items = [];
    if (children.length > 0) {
      items.push(this.renderPane1(this.getLeftSize()));
    }


    if (children.length > 1) {
      items.push(this.renderPane2(this.getRightSize()));
    }

    return items;
  }

  renderBothPanes() {
    let horizontal = this.state.dims.width >= this.state.dims.height;
    const children = React.Children.toArray(this.props.children);

    const items = [];
    if (children.length > 0) {
      items.push(this.renderPane1(horizontal ? this.getLeftSize() : this.getTopSize()));
    }

    items.push(this.renderSeparator());

    if (children.length > 1) {
      items.push(this.renderPane2(horizontal ? this.getRightSize() : this.getBottomSize()));
    }

    return items;
  }

  renderPane1(size: any) {
    const children = React.Children.toArray(this.props.children);
    if (children.length > 0) {
      return (
        <View key={PanePriority.Pane1} style={{width:size.width, height:size.height}}>
          {children[0]}
        </View>
      );
    }
  }

  renderPane2(size: any) {
    const children = React.Children.toArray(this.props.children);
    if (children.length > 1) {
      return (
        <View key={PanePriority.Pane2} style={{width:size.width, height:size.height}}>
          {children[1]}
        </View>
      );
    }
  }

  renderSeparator() {
    let horizontal = this.state.dims.width >= this.state.dims.height;
    let separatorWidth = horizontal ? DualScreenInfo.hingeWidth: '100%';
    let separatorHeight = '100%';
    return (
      <View
        key="separator"
        style={{width: separatorWidth, height: separatorHeight}}
      />
    );
  }

  getEntireSize() {
    var size = {
      width: this.state.dims.width,
      height: this.state.dims.height,
    };
    return size;
  }

  getTopSize() {
    let topHeight = this.state.dims.height/2;
    var size = {
      width: this.state.dims.width,
      height: topHeight,
    }
    return size;
  }

  getBottomSize() {
    let topHeight = this.state.dims.height/2;
    var size = {
      width: this.state.dims.width,
      height: topHeight,
    }
    return size;
  }

  getLeftSize() {
    let leftWidth = this.state.dims.width/2;
    var size = {
      width: leftWidth - DualScreenInfo.hingeWidth * .5,
      height: this.state.dims.height,
    }
    return size;
  }

  getRightSize() {
    let rightWidth = this.state.dims.width/2;
    var size = {
      width: rightWidth - DualScreenInfo.hingeWidth * .5,
      height: this.state.dims.height,
    }
    return size;
  }
}
