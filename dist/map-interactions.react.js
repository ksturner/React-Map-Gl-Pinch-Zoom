'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class; // Copyright (c) 2015 Uber Technologies, Inc.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _mapboxGl = require('mapbox-gl');

var _document = require('global/document');

var _document2 = _interopRequireDefault(_document);

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function noop() {}

var ua = typeof _window2.default.navigator !== 'undefined' ? _window2.default.navigator.userAgent.toLowerCase() : '';
var firefox = ua.indexOf('firefox') !== -1;

function mousePos(el, event) {
  var rect = el.getBoundingClientRect();
  event = event.touches ? event.touches[0] : event;
  return new _mapboxGl.Point(event.clientX - rect.left - el.clientLeft, event.clientY - rect.top - el.clientTop);
}

function touchPos(el, event) {
  var points = [];
  var rect = el.getBoundingClientRect();
  for (var i = 0; i < event.touches.length; i++) {
    points.push(new _mapboxGl.Point(event.touches[i].clientX - rect.left - el.clientLeft, event.touches[i].clientY - rect.top - el.clientTop));
  }
  return points;
}

/* eslint-disable max-len */
// Portions of the code below originally from:
// https://github.com/mapbox/mapbox-gl-js/blob/master/js/ui/handler/scroll_zoom.js
/* eslint-enable max-len */

var PROP_TYPES = {
  width: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,
  onMouseDown: _react.PropTypes.func,
  onMouseDrag: _react.PropTypes.func,
  onMouseRotate: _react.PropTypes.func,
  onMouseUp: _react.PropTypes.func,
  onMouseMove: _react.PropTypes.func,
  onTouchStart: _react.PropTypes.func,
  onTouchDrag: _react.PropTypes.func,
  onTouchRotate: _react.PropTypes.func,
  onTouchEnd: _react.PropTypes.func,
  onZoom: _react.PropTypes.func,
  onZoomEnd: _react.PropTypes.func
};

var DEFAULT_PROPS = {
  onMouseDown: noop,
  onMouseDrag: noop,
  onMouseRotate: noop,
  onMouseUp: noop,
  onMouseMove: noop,
  onTouchStart: noop,
  onTouchDrag: noop,
  onTouchRotate: noop,
  onTouchEnd: noop,
  onZoom: noop,
  onZoomEnd: noop
};

var MapInteractions = (_class = function (_Component) {
  _inherits(MapInteractions, _Component);

  function MapInteractions(props) {
    _classCallCheck(this, MapInteractions);

    var _this = _possibleConstructorReturn(this, (MapInteractions.__proto__ || Object.getPrototypeOf(MapInteractions)).call(this, props));

    _this.state = {
      startPos: null,
      pos: null,
      mouseWheelPos: null,
      pinchZoom: 0,
      fingerDist: 0
    };
    return _this;
  }

  _createClass(MapInteractions, [{
    key: '_getMousePos',
    value: function _getMousePos(event) {
      var el = this.refs.container;
      return mousePos(el, event);
    }
  }, {
    key: '_getTouchPos',
    value: function _getTouchPos(event) {
      var el = this.refs.container;
      return touchPos(el, event).reduce(function (prev, curr, i, arr) {
        return prev.add(curr.div(arr.length));
      }, new _mapboxGl.Point(0, 0));
    }
  }, {
    key: '_getFingerDist',
    value: function _getFingerDist(event) {
      return Math.sqrt((event.touches[0].clientX - event.touches[1].clientX) * (event.touches[0].clientX - event.touches[1].clientX) + (event.touches[0].clientY - event.touches[1].clientY) * (event.touches[0].clientY - event.touches[1].clientY));
    }
  }, {
    key: '_onMouseDown',
    value: function _onMouseDown(event) {
      var pos = this._getMousePos(event);
      this.setState({
        startPos: pos,
        pos: pos,
        metaKey: Boolean(event.metaKey)
      });
      this.props.onMouseDown({ pos: pos });
      _document2.default.addEventListener('mousemove', this._onMouseDrag, false);
      _document2.default.addEventListener('mouseup', this._onMouseUp, false);
    }
  }, {
    key: '_onTouchStart',
    value: function _onTouchStart(event) {
      var pos = this._getTouchPos(event);
      var newState = {
        startPos: pos,
        pos: pos,
        metaKey: Boolean(event.metaKey)
      };
      if (event.touches.length === 2) {
        newState.fingerDist = this._getFingerDist(event);
        newState.scaling = true;
      }
      this.setState(newState);
      this.props.onTouchStart({ pos: pos });
      _document2.default.addEventListener('touchmove', this._onTouchDrag, false);
      _document2.default.addEventListener('touchend', this._onTouchEnd, false);
    }
  }, {
    key: '_onMouseDrag',
    value: function _onMouseDrag(event) {
      var pos = this._getMousePos(event);
      this.setState({ pos: pos });
      if (this.state.metaKey) {
        var startPos = this.state.startPos;

        this.props.onMouseRotate({ pos: pos, startPos: startPos });
      } else {
        this.props.onMouseDrag({ pos: pos });
      }
    }
  }, {
    key: '_onTouchDrag',
    value: function _onTouchDrag(event) {
      var pos = this._getTouchPos(event);
      var newState = { pos: pos };
      if (this.state.scaling) {
        var currentFingerDist = this._getFingerDist(event);
        var zoomChange = currentFingerDist > this.state.fingerDist ? 10 : -10;
        this._zoom(this.state.pinchZoom + zoomChange, pos);
        newState.fingerDist = currentFingerDist;
      }
      this.setState(newState);
      if (this.state.metaKey) {
        var startPos = this.state.startPos;

        this.props.onTouchRotate({ pos: pos, startPos: startPos });
      } else {
        this.props.onTouchDrag({ pos: pos });
      }
      event.preventDefault();
    }
  }, {
    key: '_onMouseUp',
    value: function _onMouseUp(event) {
      _document2.default.removeEventListener('mousemove', this._onMouseDrag, false);
      _document2.default.removeEventListener('mouseup', this._onMouseUp, false);
      var pos = this._getMousePos(event);
      this.setState({ pos: pos });
      this.props.onMouseUp({ pos: pos });
    }
  }, {
    key: '_onTouchEnd',
    value: function _onTouchEnd(event) {
      _document2.default.removeEventListener('touchmove', this._onTouchDrag, false);
      _document2.default.removeEventListener('touchend', this._onTouchEnd, false);
      var pos = this._getTouchPos(event);
      var newState = { pos: pos };
      if (this.state.scaling) {
        newState.scaling = false;
      }
      this.setState(newState);
      this.props.onTouchEnd({ pos: pos });
    }
  }, {
    key: '_onMouseMove',
    value: function _onMouseMove(event) {
      var pos = this._getMousePos(event);
      this.props.onMouseMove({ pos: pos });
    }

    /* eslint-disable complexity, max-statements */

  }, {
    key: '_onWheel',
    value: function _onWheel(event) {
      event.stopPropagation();
      event.preventDefault();
      var value = event.deltaY;
      // Firefox doubles the values on retina screens...
      if (firefox && event.deltaMode === _window2.default.WheelEvent.DOM_DELTA_PIXEL) {
        value /= _window2.default.devicePixelRatio;
      }
      if (event.deltaMode === _window2.default.WheelEvent.DOM_DELTA_LINE) {
        value *= 40;
      }

      var type = this.state.mouseWheelType;
      var timeout = this.state.mouseWheelTimeout;
      var lastValue = this.state.mouseWheelLastValue;
      var time = this.state.mouseWheelTime;

      var now = (_window2.default.performance || Date).now();
      var timeDelta = now - (time || 0);

      var pos = this._getMousePos(event);
      time = now;

      if (value !== 0 && value % 4.000244140625 === 0) {
        // This one is definitely a mouse wheel event.
        type = 'wheel';
        // Normalize this value to match trackpad.
        value = Math.floor(value / 4);
      } else if (value !== 0 && Math.abs(value) < 4) {
        // This one is definitely a trackpad event because it is so small.
        type = 'trackpad';
      } else if (timeDelta > 400) {
        // This is likely a new scroll action.
        type = null;
        lastValue = value;

        // Start a timeout in case this was a singular event, and delay it by up
        // to 40ms.
        timeout = _window2.default.setTimeout(function setTimeout() {
          var _type = 'wheel';
          this._zoom(-this.state.mouseWheelLastValue, this.state.mouseWheelPos);
          this.setState({ mouseWheelType: _type });
        }.bind(this), 40);
      } else if (!this._type) {
        // This is a repeating event, but we don't know the type of event just
        // yet.
        // If the delta per time is small, we assume it's a fast trackpad;
        // otherwise we switch into wheel mode.
        type = Math.abs(timeDelta * value) < 200 ? 'trackpad' : 'wheel';

        // Make sure our delayed event isn't fired again, because we accumulate
        // the previous event (which was less than 40ms ago) into this event.
        if (timeout) {
          _window2.default.clearTimeout(timeout);
          timeout = null;
          value += lastValue;
        }
      }

      // Slow down zoom if shift key is held for more precise zooming
      if (event.shiftKey && value) {
        value = value / 4;
      }

      // Only fire the callback if we actually know what type of scrolling device
      // the user uses.
      if (type) {
        this._zoom(-value, pos);
      }

      this.setState({
        mouseWheelTime: time,
        mouseWheelPos: pos,
        mouseWheelType: type,
        mouseWheelTimeout: timeout,
        mouseWheelLastValue: lastValue
      });
    }
    /* eslint-enable complexity, max-statements */

  }, {
    key: '_zoom',
    value: function _zoom(delta, pos) {

      // Scale by sigmoid of scroll wheel delta.
      var scale = 2 / (1 + Math.exp(-Math.abs(delta / 100)));
      if (delta < 0 && scale !== 0) {
        scale = 1 / scale;
      }
      this.props.onZoom({ pos: pos, scale: scale });
      _window2.default.clearTimeout(this._zoomEndTimeout);
      this._zoomEndTimeout = _window2.default.setTimeout(function _setTimeout() {
        this.props.onZoomEnd();
      }.bind(this), 200);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        {
          ref: 'container',
          onMouseMove: this._onMouseMove,
          onMouseDown: this._onMouseDown,
          onTouchStart: this._onTouchStart,
          onContextMenu: this._onMouseDown,
          onWheel: this._onWheel,
          style: {
            width: this.props.width,
            height: this.props.height,
            position: 'relative'
          } },
        this.props.children
      );
    }
  }]);

  return MapInteractions;
}(_react.Component), (_applyDecoratedDescriptor(_class.prototype, '_onMouseDown', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseDown'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onTouchStart', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onTouchStart'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onMouseDrag', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseDrag'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onTouchDrag', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onTouchDrag'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onMouseUp', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseUp'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onTouchEnd', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onTouchEnd'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onMouseMove', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseMove'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onWheel', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onWheel'), _class.prototype)), _class);
exports.default = MapInteractions;


MapInteractions.propTypes = PROP_TYPES;
MapInteractions.defaultProps = DEFAULT_PROPS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXAtaW50ZXJhY3Rpb25zLnJlYWN0LmpzIl0sIm5hbWVzIjpbIm5vb3AiLCJ1YSIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInRvTG93ZXJDYXNlIiwiZmlyZWZveCIsImluZGV4T2YiLCJtb3VzZVBvcyIsImVsIiwiZXZlbnQiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG91Y2hlcyIsImNsaWVudFgiLCJsZWZ0IiwiY2xpZW50TGVmdCIsImNsaWVudFkiLCJ0b3AiLCJjbGllbnRUb3AiLCJ0b3VjaFBvcyIsInBvaW50cyIsImkiLCJsZW5ndGgiLCJwdXNoIiwiUFJPUF9UWVBFUyIsIndpZHRoIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsImhlaWdodCIsIm9uTW91c2VEb3duIiwiZnVuYyIsIm9uTW91c2VEcmFnIiwib25Nb3VzZVJvdGF0ZSIsIm9uTW91c2VVcCIsIm9uTW91c2VNb3ZlIiwib25Ub3VjaFN0YXJ0Iiwib25Ub3VjaERyYWciLCJvblRvdWNoUm90YXRlIiwib25Ub3VjaEVuZCIsIm9uWm9vbSIsIm9uWm9vbUVuZCIsIkRFRkFVTFRfUFJPUFMiLCJNYXBJbnRlcmFjdGlvbnMiLCJwcm9wcyIsInN0YXRlIiwic3RhcnRQb3MiLCJwb3MiLCJtb3VzZVdoZWVsUG9zIiwicGluY2hab29tIiwiZmluZ2VyRGlzdCIsInJlZnMiLCJjb250YWluZXIiLCJyZWR1Y2UiLCJwcmV2IiwiY3VyciIsImFyciIsImFkZCIsImRpdiIsIk1hdGgiLCJzcXJ0IiwiX2dldE1vdXNlUG9zIiwic2V0U3RhdGUiLCJtZXRhS2V5IiwiQm9vbGVhbiIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25Nb3VzZURyYWciLCJfb25Nb3VzZVVwIiwiX2dldFRvdWNoUG9zIiwibmV3U3RhdGUiLCJfZ2V0RmluZ2VyRGlzdCIsInNjYWxpbmciLCJfb25Ub3VjaERyYWciLCJfb25Ub3VjaEVuZCIsImN1cnJlbnRGaW5nZXJEaXN0Iiwiem9vbUNoYW5nZSIsIl96b29tIiwicHJldmVudERlZmF1bHQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwic3RvcFByb3BhZ2F0aW9uIiwidmFsdWUiLCJkZWx0YVkiLCJkZWx0YU1vZGUiLCJXaGVlbEV2ZW50IiwiRE9NX0RFTFRBX1BJWEVMIiwiZGV2aWNlUGl4ZWxSYXRpbyIsIkRPTV9ERUxUQV9MSU5FIiwidHlwZSIsIm1vdXNlV2hlZWxUeXBlIiwidGltZW91dCIsIm1vdXNlV2hlZWxUaW1lb3V0IiwibGFzdFZhbHVlIiwibW91c2VXaGVlbExhc3RWYWx1ZSIsInRpbWUiLCJtb3VzZVdoZWVsVGltZSIsIm5vdyIsInBlcmZvcm1hbmNlIiwiRGF0ZSIsInRpbWVEZWx0YSIsImZsb29yIiwiYWJzIiwic2V0VGltZW91dCIsIl90eXBlIiwiYmluZCIsImNsZWFyVGltZW91dCIsInNoaWZ0S2V5IiwiZGVsdGEiLCJzY2FsZSIsImV4cCIsIl96b29tRW5kVGltZW91dCIsIl9zZXRUaW1lb3V0IiwiX29uTW91c2VNb3ZlIiwiX29uTW91c2VEb3duIiwiX29uVG91Y2hTdGFydCIsIl9vbldoZWVsIiwicG9zaXRpb24iLCJjaGlsZHJlbiIsInByb3BUeXBlcyIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OzJCQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLFNBQVNBLElBQVQsR0FBZ0IsQ0FBRTs7QUFFbEIsSUFBTUMsS0FBSyxPQUFPLGlCQUFPQyxTQUFkLEtBQTRCLFdBQTVCLEdBQ1QsaUJBQU9BLFNBQVAsQ0FBaUJDLFNBQWpCLENBQTJCQyxXQUEzQixFQURTLEdBQ2tDLEVBRDdDO0FBRUEsSUFBTUMsVUFBVUosR0FBR0ssT0FBSCxDQUFXLFNBQVgsTUFBMEIs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QkFBYyxLQUFLQyxZQUhyQjtBQUlFLHdCQUFlLEtBQUtDLGFBSnRCO0FBS0UseUJBQWdCLEtBQUtELFlBTHZCO0FBTUUsbUJBQVUsS0FBS0UsUUFOakI7QUFPRSxpQkFBUTtBQUNOeEYsbUJBQU8sS0FBS2tCLEtBQUwsQ0FBV2xCLEtBRFo7QUFFTkcsb0JBQVEsS0FBS2UsS0FBTCxDQUFXZixNQUZiO0FBR05zRixzQkFBVTtBQUhKLFdBUFY7QUFhSSxhQUFLdkUsS0FBTCxDQUFXd0U7QUFiZixPQURGO0FBa0JEOzs7OztrQkE5T2tCekUsZTs7O0FBaVByQkEsZ0JBQWdCMEUsU0FBaEIsR0FBNEI1RixVQUE1QjtBQUNBa0IsZ0JBQWdCMkUsWUFBaEIsR0FBK0I1RSxhQUEvQiIsImZpbGUiOiJtYXAtaW50ZXJhY3Rpb25zLnJlYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG5cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzLCBDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBhdXRvYmluZCBmcm9tICdhdXRvYmluZC1kZWNvcmF0b3InO1xuaW1wb3J0IHtQb2ludH0gZnJvbSAnbWFwYm94LWdsJztcbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbmNvbnN0IHVhID0gdHlwZW9mIHdpbmRvdy5uYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnID9cbiAgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSA6ICcnO1xuY29uc3QgZmlyZWZveCA9IHVhLmluZGV4T2YoJ2ZpcmVmb3gnKSAhPT0gLTE7XG5cbmZ1bmN0aW9uIG1vdXNlUG9zKGVsLCBldmVudCkge1xuICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGV2ZW50ID0gZXZlbnQudG91Y2hlcyA/IGV2ZW50LnRvdWNoZXNbMF0gOiBldmVudDtcbiAgcmV0dXJuIG5ldyBQb2ludChcbiAgICBldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0IC0gZWwuY2xpZW50TGVmdCxcbiAgICBldmVudC5jbGllbnRZIC0gcmVjdC50b3AgLSBlbC5jbGllbnRUb3BcbiAgKTtcbn1cblxuZnVuY3Rpb24gdG91Y2hQb3MoZWwsIGV2ZW50KSB7XG4gIGNvbnN0IHBvaW50cyA9IFtdO1xuICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnQudG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgIHBvaW50cy5wdXNoKG5ldyBQb2ludChcbiAgICAgIGV2ZW50LnRvdWNoZXNbaV0uY2xpZW50WCAtIHJlY3QubGVmdCAtIGVsLmNsaWVudExlZnQsXG4gICAgICBldmVudC50b3VjaGVzW2ldLmNsaWVudFkgLSByZWN0LnRvcCAtIGVsLmNsaWVudFRvcFxuICAgICkpO1xuICB9XG4gIHJldHVybiBwb2ludHM7XG59XG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cbi8vIFBvcnRpb25zIG9mIHRoZSBjb2RlIGJlbG93IG9yaWdpbmFsbHkgZnJvbTpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXBib3gvbWFwYm94LWdsLWpzL2Jsb2IvbWFzdGVyL2pzL3VpL2hhbmRsZXIvc2Nyb2xsX3pvb20uanNcbi8qIGVzbGludC1lbmFibGUgbWF4LWxlbiAqL1xuXG5jb25zdCBQUk9QX1RZUEVTID0ge1xuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgb25Nb3VzZURvd246IFByb3BUeXBlcy5mdW5jLFxuICBvbk1vdXNlRHJhZzogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uTW91c2VSb3RhdGU6IFByb3BUeXBlcy5mdW5jLFxuICBvbk1vdXNlVXA6IFByb3BUeXBlcy5mdW5jLFxuICBvbk1vdXNlTW92ZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uVG91Y2hTdGFydDogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uVG91Y2hEcmFnOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Ub3VjaFJvdGF0ZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uVG91Y2hFbmQ6IFByb3BUeXBlcy5mdW5jLFxuICBvblpvb206IFByb3BUeXBlcy5mdW5jLFxuICBvblpvb21FbmQ6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5jb25zdCBERUZBVUxUX1BST1BTID0ge1xuICBvbk1vdXNlRG93bjogbm9vcCxcbiAgb25Nb3VzZURyYWc6IG5vb3AsXG4gIG9uTW91c2VSb3RhdGU6IG5vb3AsXG4gIG9uTW91c2VVcDogbm9vcCxcbiAgb25Nb3VzZU1vdmU6IG5vb3AsXG4gIG9uVG91Y2hTdGFydDogbm9vcCxcbiAgb25Ub3VjaERyYWc6IG5vb3AsXG4gIG9uVG91Y2hSb3RhdGU6IG5vb3AsXG4gIG9uVG91Y2hFbmQ6IG5vb3AsXG4gIG9uWm9vbTogbm9vcCxcbiAgb25ab29tRW5kOiBub29wXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXBJbnRlcmFjdGlvbnMgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBzdGFydFBvczogbnVsbCxcbiAgICAgIHBvczogbnVsbCxcbiAgICAgIG1vdXNlV2hlZWxQb3M6IG51bGwsXG4gICAgICBwaW5jaFpvb206IDAsXG4gICAgICBmaW5nZXJEaXN0OiAwXG4gICAgfTtcbiAgfVxuXG4gIF9nZXRNb3VzZVBvcyhldmVudCkge1xuICAgIGNvbnN0IGVsID0gdGhpcy5yZWZzLmNvbnRhaW5lcjtcbiAgICByZXR1cm4gbW91c2VQb3MoZWwsIGV2ZW50KTtcbiAgfVxuXG4gIF9nZXRUb3VjaFBvcyhldmVudCkge1xuICAgIGNvbnN0IGVsID0gdGhpcy5yZWZzLmNvbnRhaW5lcjtcbiAgICByZXR1cm4gdG91Y2hQb3MoZWwsIGV2ZW50KS5yZWR1Y2UoKHByZXYsIGN1cnIsIGksIGFycikgPT4ge1xuICAgICAgcmV0dXJuIHByZXYuYWRkKGN1cnIuZGl2KGFyci5sZW5ndGgpKTtcbiAgICB9LCBuZXcgUG9pbnQoMCwgMCkpO1xuICB9XG5cbiAgX2dldEZpbmdlckRpc3QoZXZlbnQpIHtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KFxuICAgICAgKGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCAtIGV2ZW50LnRvdWNoZXNbMV0uY2xpZW50WCkgKiAoZXZlbnQudG91Y2hlc1swXS5jbGllbnRYIC0gZXZlbnQudG91Y2hlc1sxXS5jbGllbnRYKSArXG4gICAgICAoZXZlbnQudG91Y2hlc1swXS5jbGllbnRZIC0gZXZlbnQudG91Y2hlc1sxXS5jbGllbnRZKSAqIChldmVudC50b3VjaGVzWzBdLmNsaWVudFkgLSBldmVudC50b3VjaGVzWzFdLmNsaWVudFkpKTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfb25Nb3VzZURvd24oZXZlbnQpIHtcbiAgICBjb25zdCBwb3MgPSB0aGlzLl9nZXRNb3VzZVBvcyhldmVudCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzdGFydFBvczogcG9zLFxuICAgICAgcG9zLFxuICAgICAgbWV0YUtleTogQm9vbGVhbihldmVudC5tZXRhS2V5KVxuICAgIH0pO1xuICAgIHRoaXMucHJvcHMub25Nb3VzZURvd24oe3Bvc30pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX29uTW91c2VEcmFnLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX29uTW91c2VVcCwgZmFsc2UpO1xuICB9XG5cbiAgQGF1dG9iaW5kXG4gIF9vblRvdWNoU3RhcnQoZXZlbnQpIHtcbiAgICBjb25zdCBwb3MgPSB0aGlzLl9nZXRUb3VjaFBvcyhldmVudCk7XG4gICAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgICBzdGFydFBvczogcG9zLFxuICAgICAgcG9zOiBwb3MsXG4gICAgICBtZXRhS2V5OiBCb29sZWFuKGV2ZW50Lm1ldGFLZXkpXG4gICAgfTtcbiAgICBpZihldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMikge1xuICAgICAgbmV3U3RhdGUuZmluZ2VyRGlzdCA9IHRoaXMuX2dldEZpbmdlckRpc3QoZXZlbnQpO1xuICAgICAgbmV3U3RhdGUuc2NhbGluZyA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUobmV3U3RhdGUpO1xuICAgIHRoaXMucHJvcHMub25Ub3VjaFN0YXJ0KHsgcG9zOiBwb3MgfSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5fb25Ub3VjaERyYWcsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuX29uVG91Y2hFbmQsIGZhbHNlKTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfb25Nb3VzZURyYWcoZXZlbnQpIHtcbiAgICBjb25zdCBwb3MgPSB0aGlzLl9nZXRNb3VzZVBvcyhldmVudCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7cG9zfSk7XG4gICAgaWYgKHRoaXMuc3RhdGUubWV0YUtleSkge1xuICAgICAgY29uc3Qge3N0YXJ0UG9zfSA9IHRoaXMuc3RhdGU7XG4gICAgICB0aGlzLnByb3BzLm9uTW91c2VSb3RhdGUoe3Bvcywgc3RhcnRQb3N9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcm9wcy5vbk1vdXNlRHJhZyh7cG9zfSk7XG4gICAgfVxuICB9XG5cbiAgQGF1dG9iaW5kXG4gIF9vblRvdWNoRHJhZyhldmVudCkge1xuICAgIGNvbnN0IHBvcyA9IHRoaXMuX2dldFRvdWNoUG9zKGV2ZW50KTtcbiAgICBjb25zdCBuZXdTdGF0ZSA9IHsgcG9zOiBwb3MgfTtcbiAgICBpZiAodGhpcy5zdGF0ZS5zY2FsaW5nKSB7XG4gICAgICBjb25zdCBjdXJyZW50RmluZ2VyRGlzdCA9IHRoaXMuX2dldEZpbmdlckRpc3QoZXZlbnQpO1xuICAgICAgY29uc3Qgem9vbUNoYW5nZSA9IGN1cnJlbnRGaW5nZXJEaXN0ID4gdGhpcy5zdGF0ZS5maW5nZXJEaXN0ID8gMTAgOiAtMTA7XG4gICAgICB0aGlzLl96b29tKHRoaXMuc3RhdGUucGluY2hab29tICsgem9vbUNoYW5nZSwgcG9zKTtcbiAgICAgIG5ld1N0YXRlLmZpbmdlckRpc3QgPSBjdXJyZW50RmluZ2VyRGlzdDtcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XG4gICAgaWYgKHRoaXMuc3RhdGUubWV0YUtleSkge1xuICAgICAgY29uc3Qgc3RhcnRQb3MgPSB0aGlzLnN0YXRlLnN0YXJ0UG9zO1xuXG4gICAgICB0aGlzLnByb3BzLm9uVG91Y2hSb3RhdGUoeyBwb3M6IHBvcywgc3RhcnRQb3M6IHN0YXJ0UG9zIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb3BzLm9uVG91Y2hEcmFnKHsgcG9zOiBwb3MgfSk7XG4gICAgfVxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgX29uTW91c2VVcChldmVudCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX29uTW91c2VEcmFnLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX29uTW91c2VVcCwgZmFsc2UpO1xuICAgIGNvbnN0IHBvcyA9IHRoaXMuX2dldE1vdXNlUG9zKGV2ZW50KTtcbiAgICB0aGlzLnNldFN0YXRlKHtwb3N9KTtcbiAgICB0aGlzLnByb3BzLm9uTW91c2VVcCh7cG9zfSk7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgX29uVG91Y2hFbmQoZXZlbnQpIHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl9vblRvdWNoRHJhZywgZmFsc2UpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5fb25Ub3VjaEVuZCwgZmFsc2UpO1xuICAgIGNvbnN0IHBvcyA9IHRoaXMuX2dldFRvdWNoUG9zKGV2ZW50KTtcbiAgICBjb25zdCBuZXdTdGF0ZSA9IHsgcG9zOiBwb3MgfVxuICAgIGlmICh0aGlzLnN0YXRlLnNjYWxpbmcpIHtcbiAgICAgIG5ld1N0YXRlLnNjYWxpbmcgPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XG4gICAgdGhpcy5wcm9wcy5vblRvdWNoRW5kKHsgcG9zOiBwb3MgfSk7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgX29uTW91c2VNb3ZlKGV2ZW50KSB7XG4gICAgY29uc3QgcG9zID0gdGhpcy5fZ2V0TW91c2VQb3MoZXZlbnQpO1xuICAgIHRoaXMucHJvcHMub25Nb3VzZU1vdmUoe3Bvc30pO1xuICB9XG5cbiAgLyogZXNsaW50LWRpc2FibGUgY29tcGxleGl0eSwgbWF4LXN0YXRlbWVudHMgKi9cbiAgQGF1dG9iaW5kXG4gIF9vbldoZWVsKGV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgdmFsdWUgPSBldmVudC5kZWx0YVk7XG4gICAgLy8gRmlyZWZveCBkb3VibGVzIHRoZSB2YWx1ZXMgb24gcmV0aW5hIHNjcmVlbnMuLi5cbiAgICBpZiAoZmlyZWZveCAmJiBldmVudC5kZWx0YU1vZGUgPT09IHdpbmRvdy5XaGVlbEV2ZW50LkRPTV9ERUxUQV9QSVhFTCkge1xuICAgICAgdmFsdWUgLz0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgfVxuICAgIGlmIChldmVudC5kZWx0YU1vZGUgPT09IHdpbmRvdy5XaGVlbEV2ZW50LkRPTV9ERUxUQV9MSU5FKSB7XG4gICAgICB2YWx1ZSAqPSA0MDtcbiAgICB9XG5cbiAgICBsZXQgdHlwZSA9IHRoaXMuc3RhdGUubW91c2VXaGVlbFR5cGU7XG4gICAgbGV0IHRpbWVvdXQgPSB0aGlzLnN0YXRlLm1vdXNlV2hlZWxUaW1lb3V0O1xuICAgIGxldCBsYXN0VmFsdWUgPSB0aGlzLnN0YXRlLm1vdXNlV2hlZWxMYXN0VmFsdWU7XG4gICAgbGV0IHRpbWUgPSB0aGlzLnN0YXRlLm1vdXNlV2hlZWxUaW1lO1xuXG4gICAgY29uc3Qgbm93ID0gKHdpbmRvdy5wZXJmb3JtYW5jZSB8fCBEYXRlKS5ub3coKTtcbiAgICBjb25zdCB0aW1lRGVsdGEgPSBub3cgLSAodGltZSB8fCAwKTtcblxuICAgIGNvbnN0IHBvcyA9IHRoaXMuX2dldE1vdXNlUG9zKGV2ZW50KTtcbiAgICB0aW1lID0gbm93O1xuXG4gICAgaWYgKHZhbHVlICE9PSAwICYmIHZhbHVlICUgNC4wMDAyNDQxNDA2MjUgPT09IDApIHtcbiAgICAgIC8vIFRoaXMgb25lIGlzIGRlZmluaXRlbHkgYSBtb3VzZSB3aGVlbCBldmVudC5cbiAgICAgIHR5cGUgPSAnd2hlZWwnO1xuICAgICAgLy8gTm9ybWFsaXplIHRoaXMgdmFsdWUgdG8gbWF0Y2ggdHJhY2twYWQuXG4gICAgICB2YWx1ZSA9IE1hdGguZmxvb3IodmFsdWUgLyA0KTtcbiAgICB9IGVsc2UgaWYgKHZhbHVlICE9PSAwICYmIE1hdGguYWJzKHZhbHVlKSA8IDQpIHtcbiAgICAgIC8vIFRoaXMgb25lIGlzIGRlZmluaXRlbHkgYSB0cmFja3BhZCBldmVudCBiZWNhdXNlIGl0IGlzIHNvIHNtYWxsLlxuICAgICAgdHlwZSA9ICd0cmFja3BhZCc7XG4gICAgfSBlbHNlIGlmICh0aW1lRGVsdGEgPiA0MDApIHtcbiAgICAgIC8vIFRoaXMgaXMgbGlrZWx5IGEgbmV3IHNjcm9sbCBhY3Rpb24uXG4gICAgICB0eXBlID0gbnVsbDtcbiAgICAgIGxhc3RWYWx1ZSA9IHZhbHVlO1xuXG4gICAgICAvLyBTdGFydCBhIHRpbWVvdXQgaW4gY2FzZSB0aGlzIHdhcyBhIHNpbmd1bGFyIGV2ZW50LCBhbmQgZGVsYXkgaXQgYnkgdXBcbiAgICAgIC8vIHRvIDQwbXMuXG4gICAgICB0aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gc2V0VGltZW91dCgpIHtcbiAgICAgICAgY29uc3QgX3R5cGUgPSAnd2hlZWwnO1xuICAgICAgICB0aGlzLl96b29tKC10aGlzLnN0YXRlLm1vdXNlV2hlZWxMYXN0VmFsdWUsIHRoaXMuc3RhdGUubW91c2VXaGVlbFBvcyk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe21vdXNlV2hlZWxUeXBlOiBfdHlwZX0pO1xuICAgICAgfS5iaW5kKHRoaXMpLCA0MCk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5fdHlwZSkge1xuICAgICAgLy8gVGhpcyBpcyBhIHJlcGVhdGluZyBldmVudCwgYnV0IHdlIGRvbid0IGtub3cgdGhlIHR5cGUgb2YgZXZlbnQganVzdFxuICAgICAgLy8geWV0LlxuICAgICAgLy8gSWYgdGhlIGRlbHRhIHBlciB0aW1lIGlzIHNtYWxsLCB3ZSBhc3N1bWUgaXQncyBhIGZhc3QgdHJhY2twYWQ7XG4gICAgICAvLyBvdGhlcndpc2Ugd2Ugc3dpdGNoIGludG8gd2hlZWwgbW9kZS5cbiAgICAgIHR5cGUgPSBNYXRoLmFicyh0aW1lRGVsdGEgKiB2YWx1ZSkgPCAyMDAgPyAndHJhY2twYWQnIDogJ3doZWVsJztcblxuICAgICAgLy8gTWFrZSBzdXJlIG91ciBkZWxheWVkIGV2ZW50IGlzbid0IGZpcmVkIGFnYWluLCBiZWNhdXNlIHdlIGFjY3VtdWxhdGVcbiAgICAgIC8vIHRoZSBwcmV2aW91cyBldmVudCAod2hpY2ggd2FzIGxlc3MgdGhhbiA0MG1zIGFnbykgaW50byB0aGlzIGV2ZW50LlxuICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIHZhbHVlICs9IGxhc3RWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTbG93IGRvd24gem9vbSBpZiBzaGlmdCBrZXkgaXMgaGVsZCBmb3IgbW9yZSBwcmVjaXNlIHpvb21pbmdcbiAgICBpZiAoZXZlbnQuc2hpZnRLZXkgJiYgdmFsdWUpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUgLyA0O1xuICAgIH1cblxuICAgIC8vIE9ubHkgZmlyZSB0aGUgY2FsbGJhY2sgaWYgd2UgYWN0dWFsbHkga25vdyB3aGF0IHR5cGUgb2Ygc2Nyb2xsaW5nIGRldmljZVxuICAgIC8vIHRoZSB1c2VyIHVzZXMuXG4gICAgaWYgKHR5cGUpIHtcbiAgICAgIHRoaXMuX3pvb20oLXZhbHVlLCBwb3MpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW91c2VXaGVlbFRpbWU6IHRpbWUsXG4gICAgICBtb3VzZVdoZWVsUG9zOiBwb3MsXG4gICAgICBtb3VzZVdoZWVsVHlwZTogdHlwZSxcbiAgICAgIG1vdXNlV2hlZWxUaW1lb3V0OiB0aW1lb3V0LFxuICAgICAgbW91c2VXaGVlbExhc3RWYWx1ZTogbGFzdFZhbHVlXG4gICAgfSk7XG4gIH1cbiAgLyogZXNsaW50LWVuYWJsZSBjb21wbGV4aXR5LCBtYXgtc3RhdGVtZW50cyAqL1xuXG4gIF96b29tKGRlbHRhLCBwb3MpIHtcblxuICAgIC8vIFNjYWxlIGJ5IHNpZ21vaWQgb2Ygc2Nyb2xsIHdoZWVsIGRlbHRhLlxuICAgIGxldCBzY2FsZSA9IDIgLyAoMSArIE1hdGguZXhwKC1NYXRoLmFicyhkZWx0YSAvIDEwMCkpKTtcbiAgICBpZiAoZGVsdGEgPCAwICYmIHNjYWxlICE9PSAwKSB7XG4gICAgICBzY2FsZSA9IDEgLyBzY2FsZTtcbiAgICB9XG4gICAgdGhpcy5wcm9wcy5vblpvb20oe3Bvcywgc2NhbGV9KTtcbiAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuX3pvb21FbmRUaW1lb3V0KTtcbiAgICB0aGlzLl96b29tRW5kVGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uIF9zZXRUaW1lb3V0KCkge1xuICAgICAgdGhpcy5wcm9wcy5vblpvb21FbmQoKTtcbiAgICB9LmJpbmQodGhpcyksIDIwMCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgcmVmPVwiY29udGFpbmVyXCJcbiAgICAgICAgb25Nb3VzZU1vdmU9eyB0aGlzLl9vbk1vdXNlTW92ZSB9XG4gICAgICAgIG9uTW91c2VEb3duPXsgdGhpcy5fb25Nb3VzZURvd24gfVxuICAgICAgICBvblRvdWNoU3RhcnQ9eyB0aGlzLl9vblRvdWNoU3RhcnQgfVxuICAgICAgICBvbkNvbnRleHRNZW51PXsgdGhpcy5fb25Nb3VzZURvd24gfVxuICAgICAgICBvbldoZWVsPXsgdGhpcy5fb25XaGVlbCB9XG4gICAgICAgIHN0eWxlPXsge1xuICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgfSB9PlxuXG4gICAgICAgIHsgdGhpcy5wcm9wcy5jaGlsZHJlbiB9XG5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuTWFwSW50ZXJhY3Rpb25zLnByb3BUeXBlcyA9IFBST1BfVFlQRVM7XG5NYXBJbnRlcmFjdGlvbnMuZGVmYXVsdFByb3BzID0gREVGQVVMVF9QUk9QUztcbiJdfQ==
