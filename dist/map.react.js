'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _desc, _value, _class2; // Copyright (c) 2015 Uber Technologies, Inc.

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

var _pureRenderDecorator = require('pure-render-decorator');

var _pureRenderDecorator2 = _interopRequireDefault(_pureRenderDecorator);

var _mapboxGl = require('mapbox-gl');

var _mapboxGl2 = _interopRequireDefault(_mapboxGl);

var _d3Selection = require('d3-selection');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _mapInteractions = require('./map-interactions.react');

var _mapInteractions2 = _interopRequireDefault(_mapInteractions);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _diffStyles2 = require('./utils/diff-styles');

var _diffStyles3 = _interopRequireDefault(_diffStyles2);

var _transform = require('./utils/transform');

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

// Note: Max pitch is a hard coded value (not a named constant) in transform.js
var MAX_PITCH = 60;
var PITCH_MOUSE_THRESHOLD = 20;
var PITCH_ACCEL = 1.2;

var PROP_TYPES = {
  /**
    * The latitude of the center of the map.
    */
  latitude: _react.PropTypes.number.isRequired,
  /**
    * The longitude of the center of the map.
    */
  longitude: _react.PropTypes.number.isRequired,
  /**
    * The tile zoom level of the map.
    */
  zoom: _react.PropTypes.number.isRequired,
  /**
    * The Mapbox style the component should use. Can either be a string url
    * or a MapboxGL style Immutable.Map object.
    */
  mapStyle: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.instanceOf(_immutable2.default.Map)]),
  /**
    * The Mapbox API access token to provide to mapbox-gl-js. This is required
    * when using Mapbox provided vector tiles and styles.
    */
  mapboxApiAccessToken: _react.PropTypes.string,
  /**
    * `onChangeViewport` callback is fired when the user interacted with the
    * map. The object passed to the callback contains `latitude`,
    * `longitude` and `zoom` and additional state information.
    */
  onChangeViewport: _react.PropTypes.func,
  /**
    * The width of the map.
    */
  width: _react.PropTypes.number.isRequired,
  /**
    * The height of the map.
    */
  height: _react.PropTypes.number.isRequired,
  /**
    * Is the component currently being dragged. This is used to show/hide the
    * drag cursor. Also used as an optimization in some overlays by preventing
    * rendering while dragging.
    */
  isDragging: _react.PropTypes.bool,
  /**
    * Required to calculate the mouse projection after the first click event
    * during dragging. Where the map is depends on where you first clicked on
    * the map.
    */
  startDragLngLat: _react.PropTypes.array,
  /**
    * Called when a feature is hovered over. Features must set the
    * `interactive` property to `true` for this to work properly. see the
    * Mapbox example: https://www.mapbox.com/mapbox-gl-js/example/featuresat/
    * The first argument of the callback will be the array of feature the
    * mouse is over. This is the same response returned from `featuresAt`.
    */
  onHoverFeatures: _react.PropTypes.func,
  /**
    * Defaults to TRUE
    * Set to false to enable onHoverFeatures to be called regardless if
    * there is an actual feature at x, y. This is useful to emulate
    * "mouse-out" behaviors on features.
    */
  ignoreEmptyFeatures: _react.PropTypes.bool,

  /**
    * Show attribution control or not.
    */
  attributionControl: _react.PropTypes.bool,

  /**
    * Called when a feature is clicked on. Features must set the
    * `interactive` property to `true` for this to work properly. see the
    * Mapbox example: https://www.mapbox.com/mapbox-gl-js/example/featuresat/
    * The first argument of the callback will be the array of feature the
    * mouse is over. This is the same response returned from `featuresAt`.
    */
  onClickFeatures: _react.PropTypes.func,

  /**
    * Radius to detect features around a clicked point. Defaults to 15.
    */
  clickRadius: _react.PropTypes.number,

  /**
    * Passed to Mapbox Map constructor which passes it to the canvas context.
    * This is unseful when you want to export the canvas as a PNG.
    */
  preserveDrawingBuffer: _react.PropTypes.bool,

  /**
    * There are still known issues with style diffing. As a temporary stopgap,
    * add the option to prevent style diffing.
    */
  preventStyleDiffing: _react.PropTypes.bool,

  /**
    * Enables perspective control event handling (Command-rotate)
    */
  perspectiveEnabled: _react.PropTypes.bool,

  /**
    * Specify the bearing of the viewport
    */
  bearing: _react2.default.PropTypes.number,

  /**
    * Specify the pitch of the viewport
    */
  pitch: _react2.default.PropTypes.number,

  /**
    * Specify the altitude of the viewport camera
    * Unit: map heights, default 1.5
    * Non-public API, see https://github.com/mapbox/mapbox-gl-js/issues/1137
    */
  altitude: _react2.default.PropTypes.number
};

var DEFAULT_PROPS = {
  mapStyle: 'mapbox://styles/mapbox/light-v8',
  onChangeViewport: null,
  mapboxApiAccessToken: _config2.default.DEFAULTS.MAPBOX_API_ACCESS_TOKEN,
  preserveDrawingBuffer: false,
  attributionControl: true,
  ignoreEmptyFeatures: true,
  bearing: 0,
  pitch: 0,
  altitude: 1.5,
  clickRadius: 15
};

var MapGL = (0, _pureRenderDecorator2.default)(_class = (_class2 = function (_Component) {
  _inherits(MapGL, _Component);

  function MapGL(props) {
    _classCallCheck(this, MapGL);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MapGL).call(this, props));

    _this.state = {
      isDragging: false,
      startDragLngLat: null,
      startBearing: null,
      startPitch: null
    };
    _mapboxGl2.default.accessToken = props.mapboxApiAccessToken;
    return _this;
  }

  _createClass(MapGL, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var mapStyle = this.props.mapStyle instanceof _immutable2.default.Map ? this.props.mapStyle.toJS() : this.props.mapStyle;
      var map = new _mapboxGl2.default.Map({
        container: this.refs.mapboxMap,
        center: [this.props.longitude, this.props.latitude],
        zoom: this.props.zoom,
        pitch: this.props.pitch,
        bearing: this.props.bearing,
        style: mapStyle,
        interactive: false,
        preserveDrawingBuffer: this.props.preserveDrawingBuffer
        // TODO?
        // attributionControl: this.props.attributionControl
      });

      (0, _d3Selection.select)(map.getCanvas()).style('outline', 'none');

      this._map = map;
      this._updateMapViewport({}, this.props);
      this._callOnChangeViewport(map.transform);
    }

    // New props are comin' round the corner!

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      this._updateStateFromProps(this.props, newProps);
      this._updateMapViewport(this.props, newProps);
      this._updateMapStyle(this.props, newProps);
      // Save width/height so that we can check them in componentDidUpdate
      this.setState({
        width: this.props.width,
        height: this.props.height
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      // map.resize() reads size from DOM, we need to call after render
      this._updateMapSize(this.state, this.props);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this._map) {
        this._map.remove();
      }
    }
  }, {
    key: '_cursor',
    value: function _cursor() {
      var isInteractive = this.props.onChangeViewport || this.props.onClickFeature || this.props.onHoverFeatures;
      if (isInteractive) {
        return this.props.isDragging ? _config2.default.CURSOR.GRABBING : _config2.default.CURSOR.GRAB;
      }
      return 'inherit';
    }
  }, {
    key: '_getMap',
    value: function _getMap() {
      return this._map;
    }
  }, {
    key: '_updateStateFromProps',
    value: function _updateStateFromProps(oldProps, newProps) {
      _mapboxGl2.default.accessToken = newProps.mapboxApiAccessToken;
      var startDragLngLat = newProps.startDragLngLat;

      this.setState({
        startDragLngLat: startDragLngLat && startDragLngLat.slice()
      });
    }

    // Individually update the maps source and layers that have changed if all
    // other style props haven't changed. This prevents flicking of the map when
    // styles only change sources or layers.
    /* eslint-disable max-statements, complexity */

  }, {
    key: '_setDiffStyle',
    value: function _setDiffStyle(prevStyle, nextStyle) {
      var prevKeysMap = prevStyle && styleKeysMap(prevStyle) || {};
      var nextKeysMap = styleKeysMap(nextStyle);
      function styleKeysMap(style) {
        return style.map(function () {
          return true;
        }).delete('layers').delete('sources').toJS();
      }
      function propsOtherThanLayersOrSourcesDiffer() {
        var prevKeysList = Object.keys(prevKeysMap);
        var nextKeysList = Object.keys(nextKeysMap);
        if (prevKeysList.length !== nextKeysList.length) {
          return true;
        }
        // `nextStyle` and `prevStyle` should not have the same set of props.
        if (nextKeysList.some(function (key) {
          return prevStyle.get(key) !== nextStyle.get(key);
        }
        // But the value of one of those props is different.
        )) {
          return true;
        }
        return false;
      }

      var map = this._getMap();

      if (!prevStyle || propsOtherThanLayersOrSourcesDiffer()) {
        map.setStyle(nextStyle.toJS());
        return;
      }

      var _diffStyles = (0, _diffStyles3.default)(prevStyle, nextStyle);

      var sourcesDiff = _diffStyles.sourcesDiff;
      var layersDiff = _diffStyles.layersDiff;

      // TODO: It's rather difficult to determine style diffing in the presence
      // of refs. For now, if any style update has a ref, fallback to no diffing.
      // We can come back to this case if there's a solid usecase.

      if (layersDiff.updates.some(function (node) {
        return node.layer.get('ref');
      })) {
        map.setStyle(nextStyle.toJS());
        return;
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = sourcesDiff.enter[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var enter = _step.value;

          map.addSource(enter.id, enter.source.toJS());
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = sourcesDiff.update[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var update = _step2.value;

          map.removeSource(update.id);
          map.addSource(update.id, update.source.toJS());
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = sourcesDiff.exit[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var exit = _step3.value;

          map.removeSource(exit.id);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = layersDiff.exiting[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _exit = _step4.value;

          if (map.style.getLayer(_exit.id)) {
            map.removeLayer(_exit.id);
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = layersDiff.updates[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _update = _step5.value;

          if (!_update.enter) {
            // This is an old layer that needs to be updated. Remove the old layer
            // with the same id and add it back again.
            map.removeLayer(_update.id);
          }
          map.addLayer(_update.layer.toJS(), _update.before);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
    /* eslint-enable max-statements, complexity */

  }, {
    key: '_updateMapStyle',
    value: function _updateMapStyle(oldProps, newProps) {
      var mapStyle = newProps.mapStyle;
      var oldMapStyle = oldProps.mapStyle;
      if (mapStyle !== oldMapStyle) {
        if (mapStyle instanceof _immutable2.default.Map) {
          if (this.props.preventStyleDiffing) {
            this._getMap().setStyle(mapStyle.toJS());
          } else {
            this._setDiffStyle(oldMapStyle, mapStyle);
          }
        } else {
          this._getMap().setStyle(mapStyle);
        }
      }
    }
  }, {
    key: '_updateMapViewport',
    value: function _updateMapViewport(oldProps, newProps) {
      var viewportChanged = newProps.latitude !== oldProps.latitude || newProps.longitude !== oldProps.longitude || newProps.zoom !== oldProps.zoom || newProps.pitch !== oldProps.pitch || newProps.zoom !== oldProps.bearing || newProps.altitude !== oldProps.altitude;

      var map = this._getMap();

      if (viewportChanged) {
        map.jumpTo({
          center: [newProps.longitude, newProps.latitude],
          zoom: newProps.zoom,
          bearing: newProps.bearing,
          pitch: newProps.pitch
        });

        // TODO - jumpTo doesn't handle altitude
        if (newProps.altitude !== oldProps.altitude) {
          map.transform.altitude = newProps.altitude;
        }
      }
    }

    // Note: needs to be called after render (e.g. in componentDidUpdate)

  }, {
    key: '_updateMapSize',
    value: function _updateMapSize(oldProps, newProps) {
      var sizeChanged = oldProps.width !== newProps.width || oldProps.height !== newProps.height;

      if (sizeChanged) {
        var map = this._getMap();
        map.resize();
        this._callOnChangeViewport(map.transform);
      }
    }
  }, {
    key: '_calculateNewPitchAndBearing',
    value: function _calculateNewPitchAndBearing(_ref) {
      var pos = _ref.pos;
      var startPos = _ref.startPos;
      var startBearing = _ref.startBearing;
      var startPitch = _ref.startPitch;

      var xDelta = pos.x - startPos.x;
      var bearing = startBearing + 180 * xDelta / this.props.width;

      var pitch = startPitch;
      var yDelta = pos.y - startPos.y;
      if (yDelta > 0) {
        // Dragging downwards, gradually decrease pitch
        if (Math.abs(this.props.height - startPos.y) > PITCH_MOUSE_THRESHOLD) {
          var scale = yDelta / (this.props.height - startPos.y);
          pitch = (1 - scale) * PITCH_ACCEL * startPitch;
        }
      } else if (yDelta < 0) {
        // Dragging upwards, gradually increase pitch
        if (startPos.y > PITCH_MOUSE_THRESHOLD) {
          // Move from 0 to 1 as we drag upwards
          var yScale = 1 - pos.y / startPos.y;
          // Gradually add until we hit max pitch
          pitch = startPitch + yScale * (MAX_PITCH - startPitch);
        }
      }

      // console.debug(startPitch, pitch);
      return {
        pitch: Math.max(Math.min(pitch, MAX_PITCH), 0),
        bearing: bearing
      };
    }

    // Helper to call props.onChangeViewport

  }, {
    key: '_callOnChangeViewport',
    value: function _callOnChangeViewport(transform) {
      var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (this.props.onChangeViewport) {
        this.props.onChangeViewport(_extends({
          latitude: transform.center.lat,
          longitude: (0, _transform.mod)(transform.center.lng + 180, 360) - 180,
          zoom: transform.zoom,
          pitch: transform.pitch,
          bearing: (0, _transform.mod)(transform.bearing + 180, 360) - 180,

          isDragging: this.props.isDragging,
          startDragLngLat: this.props.startDragLngLat,
          startBearing: this.props.startBearing,
          startPitch: this.props.startPitch

        }, opts));
      }
    }
  }, {
    key: '_onTouchStart',
    value: function _onTouchStart(_ref2) {
      var pos = _ref2.pos;

      this._onMouseDown({ pos: pos });
    }
  }, {
    key: '_onMouseDown',
    value: function _onMouseDown(_ref3) {
      var pos = _ref3.pos;

      var map = this._getMap();
      var lngLat = (0, _transform.unprojectFromTransform)(map.transform, pos);
      this._callOnChangeViewport(map.transform, {
        isDragging: true,
        startDragLngLat: [lngLat.lng, lngLat.lat],
        startBearing: map.transform.bearing,
        startPitch: map.transform.pitch
      });
    }
  }, {
    key: '_onTouchDrag',
    value: function _onTouchDrag(_ref4) {
      var pos = _ref4.pos;

      this._onMouseDrag({ pos: pos });
    }
  }, {
    key: '_onMouseDrag',
    value: function _onMouseDrag(_ref5) {
      var pos = _ref5.pos;

      if (!this.props.onChangeViewport) {
        return;
      }

      // take the start lnglat and put it where the mouse is down.
      (0, _assert2.default)(this.props.startDragLngLat, '`startDragLngLat` prop is required ' + 'for mouse drag behavior to calculate where to position the map.');

      var map = this._getMap();
      var transform = (0, _transform.cloneTransform)(map.transform);
      transform.setLocationAtPoint(this.props.startDragLngLat, pos);
      this._callOnChangeViewport(transform, {
        isDragging: true
      });
    }
  }, {
    key: '_onTouchRotate',
    value: function _onTouchRotate(_ref6) {
      var pos = _ref6.pos;
      var startPos = _ref6.startPos;

      this._onMouseRotate({ pos: pos, startPos: startPos });
    }
  }, {
    key: '_onMouseRotate',
    value: function _onMouseRotate(_ref7) {
      var pos = _ref7.pos;
      var startPos = _ref7.startPos;

      if (!this.props.onChangeViewport || !this.props.perspectiveEnabled) {
        return;
      }

      var _props = this.props;
      var startBearing = _props.startBearing;
      var startPitch = _props.startPitch;

      (0, _assert2.default)(typeof startBearing === 'number', '`startBearing` prop is required for mouse rotate behavior');
      (0, _assert2.default)(typeof startPitch === 'number', '`startPitch` prop is required for mouse rotate behavior');

      var map = this._getMap();

      var _calculateNewPitchAnd = this._calculateNewPitchAndBearing({
        pos: pos,
        startPos: startPos,
        startBearing: startBearing,
        startPitch: startPitch
      });

      var pitch = _calculateNewPitchAnd.pitch;
      var bearing = _calculateNewPitchAnd.bearing;


      var transform = (0, _transform.cloneTransform)(map.transform);
      transform.bearing = bearing;
      transform.pitch = pitch;

      this._callOnChangeViewport(transform, {
        isDragging: true
      });
    }
  }, {
    key: '_onMouseMove',
    value: function _onMouseMove(opt) {
      var map = this._getMap();
      var pos = opt.pos;
      if (!this.props.onHoverFeatures) {
        return;
      }
      var features = map.queryRenderedFeatures([pos.x, pos.y]);
      if (!features.length && this.props.ignoreEmptyFeatures) {
        return;
      }
      this.props.onHoverFeatures(features);
    }
  }, {
    key: '_onTouchEnd',
    value: function _onTouchEnd(opt) {
      this._onMouseUp(opt);
    }
  }, {
    key: '_onMouseUp',
    value: function _onMouseUp(opt) {
      var map = this._getMap();
      this._callOnChangeViewport(map.transform, {
        isDragging: false,
        startDragLngLat: null,
        startBearing: null,
        startPitch: null
      });

      if (!this.props.onClickFeatures) {
        return;
      }

      var pos = opt.pos;

      // Radius enables point features, like marker symbols, to be clicked.
      var size = this.props.clickRadius;
      var bbox = [[pos.x - size, pos.y - size], [pos.x + size, pos.y + size]];
      var features = map.queryRenderedFeatures(bbox);
      if (!features.length && this.props.ignoreEmptyFeatures) {
        return;
      }
      this.props.onClickFeatures(features);
    }
  }, {
    key: '_onZoom',
    value: function _onZoom(_ref8) {
      var pos = _ref8.pos;
      var scale = _ref8.scale;

      var map = this._getMap();
      var transform = (0, _transform.cloneTransform)(map.transform);
      var around = (0, _transform.unprojectFromTransform)(transform, pos);
      transform.zoom = transform.scaleZoom(map.transform.scale * scale);
      transform.setLocationAtPoint(around, pos);
      this._callOnChangeViewport(transform, {
        isDragging: true
      });
    }
  }, {
    key: '_onZoomEnd',
    value: function _onZoomEnd() {
      var map = this._getMap();
      this._callOnChangeViewport(map.transform, {
        isDragging: false
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var className = _props2.className;
      var width = _props2.width;
      var height = _props2.height;
      var style = _props2.style;

      var mapStyle = _extends({}, style, {
        width: width,
        height: height,
        cursor: this._cursor()
      });

      var content = [_react2.default.createElement('div', { key: 'map', ref: 'mapboxMap',
        style: mapStyle, className: className }), _react2.default.createElement(
        'div',
        { key: 'overlays', className: 'overlays',
          style: { position: 'absolute', left: 0, top: 0 } },
        this.props.children
      )];

      if (this.props.onChangeViewport) {
        content = _react2.default.createElement(
          _mapInteractions2.default,
          {
            onMouseDown: this._onMouseDown,
            onMouseDrag: this._onMouseDrag,
            onMouseRotate: this._onMouseRotate,
            onMouseUp: this._onMouseUp,
            onMouseMove: this._onMouseMove,
            onTouchStart: this._onTouchStart,
            onTouchDrag: this._onTouchDrag,
            onTouchRotate: this._onTouchRotate,
            onTouchEnd: this._onTouchEnd,
            onZoom: this._onZoom,
            onZoomEnd: this._onZoomEnd,
            width: this.props.width,
            height: this.props.height },
          content
        );
      }

      return _react2.default.createElement(
        'div',
        {
          style: _extends({}, this.props.style, {
            width: this.props.width,
            height: this.props.height,
            position: 'relative'
          }) },
        content
      );
    }
  }]);

  return MapGL;
}(_react.Component), (_applyDecoratedDescriptor(_class2.prototype, '_onTouchStart', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onTouchStart'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onMouseDown', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onMouseDown'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onTouchDrag', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onTouchDrag'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onMouseDrag', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onMouseDrag'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onTouchRotate', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onTouchRotate'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onMouseRotate', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onMouseRotate'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onMouseMove', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onMouseMove'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onTouchEnd', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onTouchEnd'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onMouseUp', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onMouseUp'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onZoom', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onZoom'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onZoomEnd', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onZoomEnd'), _class2.prototype)), _class2)) || _class;

exports.default = MapGL;


MapGL.propTypes = PROP_TYPES;
MapGL.defaultProps = DEFAULT_PROPS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXAucmVhY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7b0NBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtBQUNBLElBQU0sWUFBWSxFQUFsQjtBQUNBLElBQU0sd0JBQXdCLEVBQTlCO0FBQ0EsSUFBTSxjQUFjLEdBQXBCOztBQUVBLElBQU0sYUFBYTtBQUNqQjs7O0FBR0EsWUFBVSxpQkFBVSxNQUFWLENBQWlCLFVBSlY7QUFLakI7OztBQUdBLGFBQVcsaUJBQVUsTUFBVixDQUFpQixVQVJYO0FBU2pCOzs7QUFHQSxRQUFNLGlCQUFVLE1BQVYsQ0FBaUIsVUFaTjtBQWFqQjs7OztBQUlBLFlBQVUsaUJBQVUsU0FBVixDQUFvQixDQUM1QixpQkFBVSxNQURrQixFQUU1QixpQkFBVSxVQUFWLENBQXFCLG9CQUFVLEdBQS9CLENBRjRCLENBQXBCLENBakJPO0FBcUJqQjs7OztBQUlBLHdCQUFzQixpQkFBVSxNQXpCZjtBQTBCakI7Ozs7O0FBS0Esb0JBQWtCLGlCQUFVLElBL0JYO0FBZ0NqQjs7O0FBR0EsU0FBTyxpQkFBVSxNQUFWLENBQWlCLFVBbkNQO0FBb0NqQjs7O0FBR0EsVUFBUSxpQkFBVSxNQUFWLENBQWlCLFVBdkNSO0FBd0NqQjs7Ozs7QUFLQSxjQUFZLGlCQUFVLElBN0NMO0FBOENqQjs7Ozs7QUFLQSxtQkFBaUIsaUJBQVUsS0FuRFY7QUFvRGpCOzs7Ozs7O0FBT0EsbUJBQWlCLGlCQUFVLElBM0RWO0FBNERqQjs7Ozs7O0FBTUEsdUJBQXFCLGlCQUFVLElBbEVkOztBQW9F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QUFsQjtBQUNBLE1BQU0sWUFBTixHQUFxQixhQUFyQiIsImZpbGUiOiJtYXAucmVhY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cblxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzLCBDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBhdXRvYmluZCBmcm9tICdhdXRvYmluZC1kZWNvcmF0b3InO1xuaW1wb3J0IHB1cmVSZW5kZXIgZnJvbSAncHVyZS1yZW5kZXItZGVjb3JhdG9yJztcblxuaW1wb3J0IG1hcGJveGdsIGZyb20gJ21hcGJveC1nbCc7XG5pbXBvcnQge3NlbGVjdH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcblxuaW1wb3J0IE1hcEludGVyYWN0aW9ucyBmcm9tICcuL21hcC1pbnRlcmFjdGlvbnMucmVhY3QnO1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5cbmltcG9ydCBkaWZmU3R5bGVzIGZyb20gJy4vdXRpbHMvZGlmZi1zdHlsZXMnO1xuaW1wb3J0IHttb2QsIHVucHJvamVjdEZyb21UcmFuc2Zvcm0sIGNsb25lVHJhbnNmb3JtfSBmcm9tICcuL3V0aWxzL3RyYW5zZm9ybSc7XG5cbi8vIE5vdGU6IE1heCBwaXRjaCBpcyBhIGhhcmQgY29kZWQgdmFsdWUgKG5vdCBhIG5hbWVkIGNvbnN0YW50KSBpbiB0cmFuc2Zvcm0uanNcbmNvbnN0IE1BWF9QSVRDSCA9IDYwO1xuY29uc3QgUElUQ0hfTU9VU0VfVEhSRVNIT0xEID0gMjA7XG5jb25zdCBQSVRDSF9BQ0NFTCA9IDEuMjtcblxuY29uc3QgUFJPUF9UWVBFUyA9IHtcbiAgLyoqXG4gICAgKiBUaGUgbGF0aXR1ZGUgb2YgdGhlIGNlbnRlciBvZiB0aGUgbWFwLlxuICAgICovXG4gIGxhdGl0dWRlOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIC8qKlxuICAgICogVGhlIGxvbmdpdHVkZSBvZiB0aGUgY2VudGVyIG9mIHRoZSBtYXAuXG4gICAgKi9cbiAgbG9uZ2l0dWRlOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIC8qKlxuICAgICogVGhlIHRpbGUgem9vbSBsZXZlbCBvZiB0aGUgbWFwLlxuICAgICovXG4gIHpvb206IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgLyoqXG4gICAgKiBUaGUgTWFwYm94IHN0eWxlIHRoZSBjb21wb25lbnQgc2hvdWxkIHVzZS4gQ2FuIGVpdGhlciBiZSBhIHN0cmluZyB1cmxcbiAgICAqIG9yIGEgTWFwYm94R0wgc3R5bGUgSW1tdXRhYmxlLk1hcCBvYmplY3QuXG4gICAgKi9cbiAgbWFwU3R5bGU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLk1hcClcbiAgXSksXG4gIC8qKlxuICAgICogVGhlIE1hcGJveCBBUEkgYWNjZXNzIHRva2VuIHRvIHByb3ZpZGUgdG8gbWFwYm94LWdsLWpzLiBUaGlzIGlzIHJlcXVpcmVkXG4gICAgKiB3aGVuIHVzaW5nIE1hcGJveCBwcm92aWRlZCB2ZWN0b3IgdGlsZXMgYW5kIHN0eWxlcy5cbiAgICAqL1xuICBtYXBib3hBcGlBY2Nlc3NUb2tlbjogUHJvcFR5cGVzLnN0cmluZyxcbiAgLyoqXG4gICAgKiBgb25DaGFuZ2VWaWV3cG9ydGAgY2FsbGJhY2sgaXMgZmlyZWQgd2hlbiB0aGUgdXNlciBpbnRlcmFjdGVkIHdpdGggdGhlXG4gICAgKiBtYXAuIFRoZSBvYmplY3QgcGFzc2VkIHRvIHRoZSBjYWxsYmFjayBjb250YWlucyBgbGF0aXR1ZGVgLFxuICAgICogYGxvbmdpdHVkZWAgYW5kIGB6b29tYCBhbmQgYWRkaXRpb25hbCBzdGF0ZSBpbmZvcm1hdGlvbi5cbiAgICAqL1xuICBvbkNoYW5nZVZpZXdwb3J0OiBQcm9wVHlwZXMuZnVuYyxcbiAgLyoqXG4gICAgKiBUaGUgd2lkdGggb2YgdGhlIG1hcC5cbiAgICAqL1xuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAvKipcbiAgICAqIFRoZSBoZWlnaHQgb2YgdGhlIG1hcC5cbiAgICAqL1xuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgLyoqXG4gICAgKiBJcyB0aGUgY29tcG9uZW50IGN1cnJlbnRseSBiZWluZyBkcmFnZ2VkLiBUaGlzIGlzIHVzZWQgdG8gc2hvdy9oaWRlIHRoZVxuICAgICogZHJhZyBjdXJzb3IuIEFsc28gdXNlZCBhcyBhbiBvcHRpbWl6YXRpb24gaW4gc29tZSBvdmVybGF5cyBieSBwcmV2ZW50aW5nXG4gICAgKiByZW5kZXJpbmcgd2hpbGUgZHJhZ2dpbmcuXG4gICAgKi9cbiAgaXNEcmFnZ2luZzogUHJvcFR5cGVzLmJvb2wsXG4gIC8qKlxuICAgICogUmVxdWlyZWQgdG8gY2FsY3VsYXRlIHRoZSBtb3VzZSBwcm9qZWN0aW9uIGFmdGVyIHRoZSBmaXJzdCBjbGljayBldmVudFxuICAgICogZHVyaW5nIGRyYWdnaW5nLiBXaGVyZSB0aGUgbWFwIGlzIGRlcGVuZHMgb24gd2hlcmUgeW91IGZpcnN0IGNsaWNrZWQgb25cbiAgICAqIHRoZSBtYXAuXG4gICAgKi9cbiAgc3RhcnREcmFnTG5nTGF0OiBQcm9wVHlwZXMuYXJyYXksXG4gIC8qKlxuICAgICogQ2FsbGVkIHdoZW4gYSBmZWF0dXJlIGlzIGhvdmVyZWQgb3Zlci4gRmVhdHVyZXMgbXVzdCBzZXQgdGhlXG4gICAgKiBgaW50ZXJhY3RpdmVgIHByb3BlcnR5IHRvIGB0cnVlYCBmb3IgdGhpcyB0byB3b3JrIHByb3Blcmx5LiBzZWUgdGhlXG4gICAgKiBNYXBib3ggZXhhbXBsZTogaHR0cHM6Ly93d3cubWFwYm94LmNvbS9tYXBib3gtZ2wtanMvZXhhbXBsZS9mZWF0dXJlc2F0L1xuICAgICogVGhlIGZpcnN0IGFyZ3VtZW50IG9mIHRoZSBjYWxsYmFjayB3aWxsIGJlIHRoZSBhcnJheSBvZiBmZWF0dXJlIHRoZVxuICAgICogbW91c2UgaXMgb3Zlci4gVGhpcyBpcyB0aGUgc2FtZSByZXNwb25zZSByZXR1cm5lZCBmcm9tIGBmZWF0dXJlc0F0YC5cbiAgICAqL1xuICBvbkhvdmVyRmVhdHVyZXM6IFByb3BUeXBlcy5mdW5jLFxuICAvKipcbiAgICAqIERlZmF1bHRzIHRvIFRSVUVcbiAgICAqIFNldCB0byBmYWxzZSB0byBlbmFibGUgb25Ib3ZlckZlYXR1cmVzIHRvIGJlIGNhbGxlZCByZWdhcmRsZXNzIGlmXG4gICAgKiB0aGVyZSBpcyBhbiBhY3R1YWwgZmVhdHVyZSBhdCB4LCB5LiBUaGlzIGlzIHVzZWZ1bCB0byBlbXVsYXRlXG4gICAgKiBcIm1vdXNlLW91dFwiIGJlaGF2aW9ycyBvbiBmZWF0dXJlcy5cbiAgICAqL1xuICBpZ25vcmVFbXB0eUZlYXR1cmVzOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICAqIFNob3cgYXR0cmlidXRpb24gY29udHJvbCBvciBub3QuXG4gICAgKi9cbiAgYXR0cmlidXRpb25Db250cm9sOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICAqIENhbGxlZCB3aGVuIGEgZmVhdHVyZSBpcyBjbGlja2VkIG9uLiBGZWF0dXJlcyBtdXN0IHNldCB0aGVcbiAgICAqIGBpbnRlcmFjdGl2ZWAgcHJvcGVydHkgdG8gYHRydWVgIGZvciB0aGlzIHRvIHdvcmsgcHJvcGVybHkuIHNlZSB0aGVcbiAgICAqIE1hcGJveCBleGFtcGxlOiBodHRwczovL3d3dy5tYXBib3guY29tL21hcGJveC1nbC1qcy9leGFtcGxlL2ZlYXR1cmVzYXQvXG4gICAgKiBUaGUgZmlyc3QgYXJndW1lbnQgb2YgdGhlIGNhbGxiYWNrIHdpbGwgYmUgdGhlIGFycmF5IG9mIGZlYXR1cmUgdGhlXG4gICAgKiBtb3VzZSBpcyBvdmVyLiBUaGlzIGlzIHRoZSBzYW1lIHJlc3BvbnNlIHJldHVybmVkIGZyb20gYGZlYXR1cmVzQXRgLlxuICAgICovXG4gIG9uQ2xpY2tGZWF0dXJlczogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgLyoqXG4gICAgKiBSYWRpdXMgdG8gZGV0ZWN0IGZlYXR1cmVzIGFyb3VuZCBhIGNsaWNrZWQgcG9pbnQuIERlZmF1bHRzIHRvIDE1LlxuICAgICovXG4gIGNsaWNrUmFkaXVzOiBQcm9wVHlwZXMubnVtYmVyLFxuXG4gIC8qKlxuICAgICogUGFzc2VkIHRvIE1hcGJveCBNYXAgY29uc3RydWN0b3Igd2hpY2ggcGFzc2VzIGl0IHRvIHRoZSBjYW52YXMgY29udGV4dC5cbiAgICAqIFRoaXMgaXMgdW5zZWZ1bCB3aGVuIHlvdSB3YW50IHRvIGV4cG9ydCB0aGUgY2FudmFzIGFzIGEgUE5HLlxuICAgICovXG4gIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAgKiBUaGVyZSBhcmUgc3RpbGwga25vd24gaXNzdWVzIHdpdGggc3R5bGUgZGlmZmluZy4gQXMgYSB0ZW1wb3Jhcnkgc3RvcGdhcCxcbiAgICAqIGFkZCB0aGUgb3B0aW9uIHRvIHByZXZlbnQgc3R5bGUgZGlmZmluZy5cbiAgICAqL1xuICBwcmV2ZW50U3R5bGVEaWZmaW5nOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICAqIEVuYWJsZXMgcGVyc3BlY3RpdmUgY29udHJvbCBldmVudCBoYW5kbGluZyAoQ29tbWFuZC1yb3RhdGUpXG4gICAgKi9cbiAgcGVyc3BlY3RpdmVFbmFibGVkOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICAqIFNwZWNpZnkgdGhlIGJlYXJpbmcgb2YgdGhlIHZpZXdwb3J0XG4gICAgKi9cbiAgYmVhcmluZzogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcblxuICAvKipcbiAgICAqIFNwZWNpZnkgdGhlIHBpdGNoIG9mIHRoZSB2aWV3cG9ydFxuICAgICovXG4gIHBpdGNoOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuXG4gIC8qKlxuICAgICogU3BlY2lmeSB0aGUgYWx0aXR1ZGUgb2YgdGhlIHZpZXdwb3J0IGNhbWVyYVxuICAgICogVW5pdDogbWFwIGhlaWdodHMsIGRlZmF1bHQgMS41XG4gICAgKiBOb24tcHVibGljIEFQSSwgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXBib3gvbWFwYm94LWdsLWpzL2lzc3Vlcy8xMTM3XG4gICAgKi9cbiAgYWx0aXR1ZGU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXJcbn07XG5cbmNvbnN0IERFRkFVTFRfUFJPUFMgPSB7XG4gIG1hcFN0eWxlOiAnbWFwYm94Oi8vc3R5bGVzL21hcGJveC9saWdodC12OCcsXG4gIG9uQ2hhbmdlVmlld3BvcnQ6IG51bGwsXG4gIG1hcGJveEFwaUFjY2Vzc1Rva2VuOiBjb25maWcuREVGQVVMVFMuTUFQQk9YX0FQSV9BQ0NFU1NfVE9LRU4sXG4gIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogZmFsc2UsXG4gIGF0dHJpYnV0aW9uQ29udHJvbDogdHJ1ZSxcbiAgaWdub3JlRW1wdHlGZWF0dXJlczogdHJ1ZSxcbiAgYmVhcmluZzogMCxcbiAgcGl0Y2g6IDAsXG4gIGFsdGl0dWRlOiAxLjUsXG4gIGNsaWNrUmFkaXVzOiAxNVxufTtcblxuQHB1cmVSZW5kZXJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcEdMIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaXNEcmFnZ2luZzogZmFsc2UsXG4gICAgICBzdGFydERyYWdMbmdMYXQ6IG51bGwsXG4gICAgICBzdGFydEJlYXJpbmc6IG51bGwsXG4gICAgICBzdGFydFBpdGNoOiBudWxsXG4gICAgfTtcbiAgICBtYXBib3hnbC5hY2Nlc3NUb2tlbiA9IHByb3BzLm1hcGJveEFwaUFjY2Vzc1Rva2VuO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc3QgbWFwU3R5bGUgPSB0aGlzLnByb3BzLm1hcFN0eWxlIGluc3RhbmNlb2YgSW1tdXRhYmxlLk1hcCA/XG4gICAgICB0aGlzLnByb3BzLm1hcFN0eWxlLnRvSlMoKSA6XG4gICAgICB0aGlzLnByb3BzLm1hcFN0eWxlO1xuICAgIGNvbnN0IG1hcCA9IG5ldyBtYXBib3hnbC5NYXAoe1xuICAgICAgY29udGFpbmVyOiB0aGlzLnJlZnMubWFwYm94TWFwLFxuICAgICAgY2VudGVyOiBbdGhpcy5wcm9wcy5sb25naXR1ZGUsIHRoaXMucHJvcHMubGF0aXR1ZGVdLFxuICAgICAgem9vbTogdGhpcy5wcm9wcy56b29tLFxuICAgICAgcGl0Y2g6IHRoaXMucHJvcHMucGl0Y2gsXG4gICAgICBiZWFyaW5nOiB0aGlzLnByb3BzLmJlYXJpbmcsXG4gICAgICBzdHlsZTogbWFwU3R5bGUsXG4gICAgICBpbnRlcmFjdGl2ZTogZmFsc2UsXG4gICAgICBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRoaXMucHJvcHMucHJlc2VydmVEcmF3aW5nQnVmZmVyXG4gICAgICAvLyBUT0RPP1xuICAgICAgLy8gYXR0cmlidXRpb25Db250cm9sOiB0aGlzLnByb3BzLmF0dHJpYnV0aW9uQ29udHJvbFxuICAgIH0pO1xuXG4gICAgc2VsZWN0KG1hcC5nZXRDYW52YXMoKSkuc3R5bGUoJ291dGxpbmUnLCAnbm9uZScpO1xuXG4gICAgdGhpcy5fbWFwID0gbWFwO1xuICAgIHRoaXMuX3VwZGF0ZU1hcFZpZXdwb3J0KHt9LCB0aGlzLnByb3BzKTtcbiAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydChtYXAudHJhbnNmb3JtKTtcbiAgfVxuXG4gIC8vIE5ldyBwcm9wcyBhcmUgY29taW4nIHJvdW5kIHRoZSBjb3JuZXIhXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV3UHJvcHMpIHtcbiAgICB0aGlzLl91cGRhdGVTdGF0ZUZyb21Qcm9wcyh0aGlzLnByb3BzLCBuZXdQcm9wcyk7XG4gICAgdGhpcy5fdXBkYXRlTWFwVmlld3BvcnQodGhpcy5wcm9wcywgbmV3UHJvcHMpO1xuICAgIHRoaXMuX3VwZGF0ZU1hcFN0eWxlKHRoaXMucHJvcHMsIG5ld1Byb3BzKTtcbiAgICAvLyBTYXZlIHdpZHRoL2hlaWdodCBzbyB0aGF0IHdlIGNhbiBjaGVjayB0aGVtIGluIGNvbXBvbmVudERpZFVwZGF0ZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXG4gICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0XG4gICAgfSk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgLy8gbWFwLnJlc2l6ZSgpIHJlYWRzIHNpemUgZnJvbSBET00sIHdlIG5lZWQgdG8gY2FsbCBhZnRlciByZW5kZXJcbiAgICB0aGlzLl91cGRhdGVNYXBTaXplKHRoaXMuc3RhdGUsIHRoaXMucHJvcHMpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgaWYgKHRoaXMuX21hcCkge1xuICAgICAgdGhpcy5fbWFwLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxuXG4gIF9jdXJzb3IoKSB7XG4gICAgY29uc3QgaXNJbnRlcmFjdGl2ZSA9XG4gICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlVmlld3BvcnQgfHxcbiAgICAgIHRoaXMucHJvcHMub25DbGlja0ZlYXR1cmUgfHxcbiAgICAgIHRoaXMucHJvcHMub25Ib3ZlckZlYXR1cmVzO1xuICAgIGlmIChpc0ludGVyYWN0aXZlKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5pc0RyYWdnaW5nID9cbiAgICAgICAgY29uZmlnLkNVUlNPUi5HUkFCQklORyA6IGNvbmZpZy5DVVJTT1IuR1JBQjtcbiAgICB9XG4gICAgcmV0dXJuICdpbmhlcml0JztcbiAgfVxuXG4gIF9nZXRNYXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcDtcbiAgfVxuXG4gIF91cGRhdGVTdGF0ZUZyb21Qcm9wcyhvbGRQcm9wcywgbmV3UHJvcHMpIHtcbiAgICBtYXBib3hnbC5hY2Nlc3NUb2tlbiA9IG5ld1Byb3BzLm1hcGJveEFwaUFjY2Vzc1Rva2VuO1xuICAgIGNvbnN0IHtzdGFydERyYWdMbmdMYXR9ID0gbmV3UHJvcHM7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzdGFydERyYWdMbmdMYXQ6IHN0YXJ0RHJhZ0xuZ0xhdCAmJiBzdGFydERyYWdMbmdMYXQuc2xpY2UoKVxuICAgIH0pO1xuICB9XG5cbiAgLy8gSW5kaXZpZHVhbGx5IHVwZGF0ZSB0aGUgbWFwcyBzb3VyY2UgYW5kIGxheWVycyB0aGF0IGhhdmUgY2hhbmdlZCBpZiBhbGxcbiAgLy8gb3RoZXIgc3R5bGUgcHJvcHMgaGF2ZW4ndCBjaGFuZ2VkLiBUaGlzIHByZXZlbnRzIGZsaWNraW5nIG9mIHRoZSBtYXAgd2hlblxuICAvLyBzdHlsZXMgb25seSBjaGFuZ2Ugc291cmNlcyBvciBsYXllcnMuXG4gIC8qIGVzbGludC1kaXNhYmxlIG1heC1zdGF0ZW1lbnRzLCBjb21wbGV4aXR5ICovXG4gIF9zZXREaWZmU3R5bGUocHJldlN0eWxlLCBuZXh0U3R5bGUpIHtcbiAgICBjb25zdCBwcmV2S2V5c01hcCA9IHByZXZTdHlsZSAmJiBzdHlsZUtleXNNYXAocHJldlN0eWxlKSB8fCB7fTtcbiAgICBjb25zdCBuZXh0S2V5c01hcCA9IHN0eWxlS2V5c01hcChuZXh0U3R5bGUpO1xuICAgIGZ1bmN0aW9uIHN0eWxlS2V5c01hcChzdHlsZSkge1xuICAgICAgcmV0dXJuIHN0eWxlLm1hcCgoKSA9PiB0cnVlKS5kZWxldGUoJ2xheWVycycpLmRlbGV0ZSgnc291cmNlcycpLnRvSlMoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcHJvcHNPdGhlclRoYW5MYXllcnNPclNvdXJjZXNEaWZmZXIoKSB7XG4gICAgICBjb25zdCBwcmV2S2V5c0xpc3QgPSBPYmplY3Qua2V5cyhwcmV2S2V5c01hcCk7XG4gICAgICBjb25zdCBuZXh0S2V5c0xpc3QgPSBPYmplY3Qua2V5cyhuZXh0S2V5c01hcCk7XG4gICAgICBpZiAocHJldktleXNMaXN0Lmxlbmd0aCAhPT0gbmV4dEtleXNMaXN0Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIC8vIGBuZXh0U3R5bGVgIGFuZCBgcHJldlN0eWxlYCBzaG91bGQgbm90IGhhdmUgdGhlIHNhbWUgc2V0IG9mIHByb3BzLlxuICAgICAgaWYgKG5leHRLZXlzTGlzdC5zb21lKFxuICAgICAgICBrZXkgPT4gcHJldlN0eWxlLmdldChrZXkpICE9PSBuZXh0U3R5bGUuZ2V0KGtleSlcbiAgICAgICAgLy8gQnV0IHRoZSB2YWx1ZSBvZiBvbmUgb2YgdGhvc2UgcHJvcHMgaXMgZGlmZmVyZW50LlxuICAgICAgKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcblxuICAgIGlmICghcHJldlN0eWxlIHx8IHByb3BzT3RoZXJUaGFuTGF5ZXJzT3JTb3VyY2VzRGlmZmVyKCkpIHtcbiAgICAgIG1hcC5zZXRTdHlsZShuZXh0U3R5bGUudG9KUygpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7c291cmNlc0RpZmYsIGxheWVyc0RpZmZ9ID0gZGlmZlN0eWxlcyhwcmV2U3R5bGUsIG5leHRTdHlsZSk7XG5cbiAgICAvLyBUT0RPOiBJdCdzIHJhdGhlciBkaWZmaWN1bHQgdG8gZGV0ZXJtaW5lIHN0eWxlIGRpZmZpbmcgaW4gdGhlIHByZXNlbmNlXG4gICAgLy8gb2YgcmVmcy4gRm9yIG5vdywgaWYgYW55IHN0eWxlIHVwZGF0ZSBoYXMgYSByZWYsIGZhbGxiYWNrIHRvIG5vIGRpZmZpbmcuXG4gICAgLy8gV2UgY2FuIGNvbWUgYmFjayB0byB0aGlzIGNhc2UgaWYgdGhlcmUncyBhIHNvbGlkIHVzZWNhc2UuXG4gICAgaWYgKGxheWVyc0RpZmYudXBkYXRlcy5zb21lKG5vZGUgPT4gbm9kZS5sYXllci5nZXQoJ3JlZicpKSkge1xuICAgICAgbWFwLnNldFN0eWxlKG5leHRTdHlsZS50b0pTKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgZW50ZXIgb2Ygc291cmNlc0RpZmYuZW50ZXIpIHtcbiAgICAgIG1hcC5hZGRTb3VyY2UoZW50ZXIuaWQsIGVudGVyLnNvdXJjZS50b0pTKCkpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHVwZGF0ZSBvZiBzb3VyY2VzRGlmZi51cGRhdGUpIHtcbiAgICAgIG1hcC5yZW1vdmVTb3VyY2UodXBkYXRlLmlkKTtcbiAgICAgIG1hcC5hZGRTb3VyY2UodXBkYXRlLmlkLCB1cGRhdGUuc291cmNlLnRvSlMoKSk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgZXhpdCBvZiBzb3VyY2VzRGlmZi5leGl0KSB7XG4gICAgICBtYXAucmVtb3ZlU291cmNlKGV4aXQuaWQpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGV4aXQgb2YgbGF5ZXJzRGlmZi5leGl0aW5nKSB7XG4gICAgICBpZiAobWFwLnN0eWxlLmdldExheWVyKGV4aXQuaWQpKSB7XG4gICAgICAgIG1hcC5yZW1vdmVMYXllcihleGl0LmlkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCB1cGRhdGUgb2YgbGF5ZXJzRGlmZi51cGRhdGVzKSB7XG4gICAgICBpZiAoIXVwZGF0ZS5lbnRlcikge1xuICAgICAgICAvLyBUaGlzIGlzIGFuIG9sZCBsYXllciB0aGF0IG5lZWRzIHRvIGJlIHVwZGF0ZWQuIFJlbW92ZSB0aGUgb2xkIGxheWVyXG4gICAgICAgIC8vIHdpdGggdGhlIHNhbWUgaWQgYW5kIGFkZCBpdCBiYWNrIGFnYWluLlxuICAgICAgICBtYXAucmVtb3ZlTGF5ZXIodXBkYXRlLmlkKTtcbiAgICAgIH1cbiAgICAgIG1hcC5hZGRMYXllcih1cGRhdGUubGF5ZXIudG9KUygpLCB1cGRhdGUuYmVmb3JlKTtcbiAgICB9XG4gIH1cbiAgLyogZXNsaW50LWVuYWJsZSBtYXgtc3RhdGVtZW50cywgY29tcGxleGl0eSAqL1xuXG4gIF91cGRhdGVNYXBTdHlsZShvbGRQcm9wcywgbmV3UHJvcHMpIHtcbiAgICBjb25zdCBtYXBTdHlsZSA9IG5ld1Byb3BzLm1hcFN0eWxlO1xuICAgIGNvbnN0IG9sZE1hcFN0eWxlID0gb2xkUHJvcHMubWFwU3R5bGU7XG4gICAgaWYgKG1hcFN0eWxlICE9PSBvbGRNYXBTdHlsZSkge1xuICAgICAgaWYgKG1hcFN0eWxlIGluc3RhbmNlb2YgSW1tdXRhYmxlLk1hcCkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5wcmV2ZW50U3R5bGVEaWZmaW5nKSB7XG4gICAgICAgICAgdGhpcy5fZ2V0TWFwKCkuc2V0U3R5bGUobWFwU3R5bGUudG9KUygpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9zZXREaWZmU3R5bGUob2xkTWFwU3R5bGUsIG1hcFN0eWxlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZ2V0TWFwKCkuc2V0U3R5bGUobWFwU3R5bGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF91cGRhdGVNYXBWaWV3cG9ydChvbGRQcm9wcywgbmV3UHJvcHMpIHtcbiAgICBjb25zdCB2aWV3cG9ydENoYW5nZWQgPVxuICAgICAgbmV3UHJvcHMubGF0aXR1ZGUgIT09IG9sZFByb3BzLmxhdGl0dWRlIHx8XG4gICAgICBuZXdQcm9wcy5sb25naXR1ZGUgIT09IG9sZFByb3BzLmxvbmdpdHVkZSB8fFxuICAgICAgbmV3UHJvcHMuem9vbSAhPT0gb2xkUHJvcHMuem9vbSB8fFxuICAgICAgbmV3UHJvcHMucGl0Y2ggIT09IG9sZFByb3BzLnBpdGNoIHx8XG4gICAgICBuZXdQcm9wcy56b29tICE9PSBvbGRQcm9wcy5iZWFyaW5nIHx8XG4gICAgICBuZXdQcm9wcy5hbHRpdHVkZSAhPT0gb2xkUHJvcHMuYWx0aXR1ZGU7XG5cbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcblxuICAgIGlmICh2aWV3cG9ydENoYW5nZWQpIHtcbiAgICAgIG1hcC5qdW1wVG8oe1xuICAgICAgICBjZW50ZXI6IFtuZXdQcm9wcy5sb25naXR1ZGUsIG5ld1Byb3BzLmxhdGl0dWRlXSxcbiAgICAgICAgem9vbTogbmV3UHJvcHMuem9vbSxcbiAgICAgICAgYmVhcmluZzogbmV3UHJvcHMuYmVhcmluZyxcbiAgICAgICAgcGl0Y2g6IG5ld1Byb3BzLnBpdGNoXG4gICAgICB9KTtcblxuICAgICAgLy8gVE9ETyAtIGp1bXBUbyBkb2Vzbid0IGhhbmRsZSBhbHRpdHVkZVxuICAgICAgaWYgKG5ld1Byb3BzLmFsdGl0dWRlICE9PSBvbGRQcm9wcy5hbHRpdHVkZSkge1xuICAgICAgICBtYXAudHJhbnNmb3JtLmFsdGl0dWRlID0gbmV3UHJvcHMuYWx0aXR1ZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gTm90ZTogbmVlZHMgdG8gYmUgY2FsbGVkIGFmdGVyIHJlbmRlciAoZS5nLiBpbiBjb21wb25lbnREaWRVcGRhdGUpXG4gIF91cGRhdGVNYXBTaXplKG9sZFByb3BzLCBuZXdQcm9wcykge1xuICAgIGNvbnN0IHNpemVDaGFuZ2VkID1cbiAgICAgIG9sZFByb3BzLndpZHRoICE9PSBuZXdQcm9wcy53aWR0aCB8fCBvbGRQcm9wcy5oZWlnaHQgIT09IG5ld1Byb3BzLmhlaWdodDtcblxuICAgIGlmIChzaXplQ2hhbmdlZCkge1xuICAgICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG4gICAgICBtYXAucmVzaXplKCk7XG4gICAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydChtYXAudHJhbnNmb3JtKTtcbiAgICB9XG4gIH1cblxuICBfY2FsY3VsYXRlTmV3UGl0Y2hBbmRCZWFyaW5nKHtwb3MsIHN0YXJ0UG9zLCBzdGFydEJlYXJpbmcsIHN0YXJ0UGl0Y2h9KSB7XG4gICAgY29uc3QgeERlbHRhID0gcG9zLnggLSBzdGFydFBvcy54O1xuICAgIGNvbnN0IGJlYXJpbmcgPSBzdGFydEJlYXJpbmcgKyAxODAgKiB4RGVsdGEgLyB0aGlzLnByb3BzLndpZHRoO1xuXG4gICAgbGV0IHBpdGNoID0gc3RhcnRQaXRjaDtcbiAgICBjb25zdCB5RGVsdGEgPSBwb3MueSAtIHN0YXJ0UG9zLnk7XG4gICAgaWYgKHlEZWx0YSA+IDApIHtcbiAgICAgIC8vIERyYWdnaW5nIGRvd253YXJkcywgZ3JhZHVhbGx5IGRlY3JlYXNlIHBpdGNoXG4gICAgICBpZiAoTWF0aC5hYnModGhpcy5wcm9wcy5oZWlnaHQgLSBzdGFydFBvcy55KSA+IFBJVENIX01PVVNFX1RIUkVTSE9MRCkge1xuICAgICAgICBjb25zdCBzY2FsZSA9IHlEZWx0YSAvICh0aGlzLnByb3BzLmhlaWdodCAtIHN0YXJ0UG9zLnkpO1xuICAgICAgICBwaXRjaCA9ICgxIC0gc2NhbGUpICogUElUQ0hfQUNDRUwgKiBzdGFydFBpdGNoO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoeURlbHRhIDwgMCkge1xuICAgICAgLy8gRHJhZ2dpbmcgdXB3YXJkcywgZ3JhZHVhbGx5IGluY3JlYXNlIHBpdGNoXG4gICAgICBpZiAoc3RhcnRQb3MueSA+IFBJVENIX01PVVNFX1RIUkVTSE9MRCkge1xuICAgICAgICAvLyBNb3ZlIGZyb20gMCB0byAxIGFzIHdlIGRyYWcgdXB3YXJkc1xuICAgICAgICBjb25zdCB5U2NhbGUgPSAxIC0gcG9zLnkgLyBzdGFydFBvcy55O1xuICAgICAgICAvLyBHcmFkdWFsbHkgYWRkIHVudGlsIHdlIGhpdCBtYXggcGl0Y2hcbiAgICAgICAgcGl0Y2ggPSBzdGFydFBpdGNoICsgeVNjYWxlICogKE1BWF9QSVRDSCAtIHN0YXJ0UGl0Y2gpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvbnNvbGUuZGVidWcoc3RhcnRQaXRjaCwgcGl0Y2gpO1xuICAgIHJldHVybiB7XG4gICAgICBwaXRjaDogTWF0aC5tYXgoTWF0aC5taW4ocGl0Y2gsIE1BWF9QSVRDSCksIDApLFxuICAgICAgYmVhcmluZ1xuICAgIH07XG4gIH1cblxuICAgLy8gSGVscGVyIHRvIGNhbGwgcHJvcHMub25DaGFuZ2VWaWV3cG9ydFxuICBfY2FsbE9uQ2hhbmdlVmlld3BvcnQodHJhbnNmb3JtLCBvcHRzID0ge30pIHtcbiAgICBpZiAodGhpcy5wcm9wcy5vbkNoYW5nZVZpZXdwb3J0KSB7XG4gICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlVmlld3BvcnQoe1xuICAgICAgICBsYXRpdHVkZTogdHJhbnNmb3JtLmNlbnRlci5sYXQsXG4gICAgICAgIGxvbmdpdHVkZTogbW9kKHRyYW5zZm9ybS5jZW50ZXIubG5nICsgMTgwLCAzNjApIC0gMTgwLFxuICAgICAgICB6b29tOiB0cmFuc2Zvcm0uem9vbSxcbiAgICAgICAgcGl0Y2g6IHRyYW5zZm9ybS5waXRjaCxcbiAgICAgICAgYmVhcmluZzogbW9kKHRyYW5zZm9ybS5iZWFyaW5nICsgMTgwLCAzNjApIC0gMTgwLFxuXG4gICAgICAgIGlzRHJhZ2dpbmc6IHRoaXMucHJvcHMuaXNEcmFnZ2luZyxcbiAgICAgICAgc3RhcnREcmFnTG5nTGF0OiB0aGlzLnByb3BzLnN0YXJ0RHJhZ0xuZ0xhdCxcbiAgICAgICAgc3RhcnRCZWFyaW5nOiB0aGlzLnByb3BzLnN0YXJ0QmVhcmluZyxcbiAgICAgICAgc3RhcnRQaXRjaDogdGhpcy5wcm9wcy5zdGFydFBpdGNoLFxuXG4gICAgICAgIC4uLm9wdHNcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIEBhdXRvYmluZCBfb25Ub3VjaFN0YXJ0KHtwb3N9KSB7XG4gICAgdGhpcy5fb25Nb3VzZURvd24oe3Bvc30pO1xuICB9XG5cbiAgQGF1dG9iaW5kIF9vbk1vdXNlRG93bih7cG9zfSkge1xuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuICAgIGNvbnN0IGxuZ0xhdCA9IHVucHJvamVjdEZyb21UcmFuc2Zvcm0obWFwLnRyYW5zZm9ybSwgcG9zKTtcbiAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydChtYXAudHJhbnNmb3JtLCB7XG4gICAgICBpc0RyYWdnaW5nOiB0cnVlLFxuICAgICAgc3RhcnREcmFnTG5nTGF0OiBbbG5nTGF0LmxuZywgbG5nTGF0LmxhdF0sXG4gICAgICBzdGFydEJlYXJpbmc6IG1hcC50cmFuc2Zvcm0uYmVhcmluZyxcbiAgICAgIHN0YXJ0UGl0Y2g6IG1hcC50cmFuc2Zvcm0ucGl0Y2hcbiAgICB9KTtcbiAgfVxuXG4gIEBhdXRvYmluZCBfb25Ub3VjaERyYWcoe3Bvc30pIHtcbiAgICB0aGlzLl9vbk1vdXNlRHJhZyh7cG9zfSk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uTW91c2VEcmFnKHtwb3N9KSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLm9uQ2hhbmdlVmlld3BvcnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB0YWtlIHRoZSBzdGFydCBsbmdsYXQgYW5kIHB1dCBpdCB3aGVyZSB0aGUgbW91c2UgaXMgZG93bi5cbiAgICBhc3NlcnQodGhpcy5wcm9wcy5zdGFydERyYWdMbmdMYXQsICdgc3RhcnREcmFnTG5nTGF0YCBwcm9wIGlzIHJlcXVpcmVkICcgK1xuICAgICAgJ2ZvciBtb3VzZSBkcmFnIGJlaGF2aW9yIHRvIGNhbGN1bGF0ZSB3aGVyZSB0byBwb3NpdGlvbiB0aGUgbWFwLicpO1xuXG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG4gICAgY29uc3QgdHJhbnNmb3JtID0gY2xvbmVUcmFuc2Zvcm0obWFwLnRyYW5zZm9ybSk7XG4gICAgdHJhbnNmb3JtLnNldExvY2F0aW9uQXRQb2ludCh0aGlzLnByb3BzLnN0YXJ0RHJhZ0xuZ0xhdCwgcG9zKTtcbiAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydCh0cmFuc2Zvcm0sIHtcbiAgICAgIGlzRHJhZ2dpbmc6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIEBhdXRvYmluZCBfb25Ub3VjaFJvdGF0ZSh7cG9zLCBzdGFydFBvc30pIHtcbiAgICB0aGlzLl9vbk1vdXNlUm90YXRlKHtwb3MsIHN0YXJ0UG9zfSk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uTW91c2VSb3RhdGUoe3Bvcywgc3RhcnRQb3N9KSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLm9uQ2hhbmdlVmlld3BvcnQgfHwgIXRoaXMucHJvcHMucGVyc3BlY3RpdmVFbmFibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qge3N0YXJ0QmVhcmluZywgc3RhcnRQaXRjaH0gPSB0aGlzLnByb3BzO1xuICAgIGFzc2VydCh0eXBlb2Ygc3RhcnRCZWFyaW5nID09PSAnbnVtYmVyJyxcbiAgICAgICdgc3RhcnRCZWFyaW5nYCBwcm9wIGlzIHJlcXVpcmVkIGZvciBtb3VzZSByb3RhdGUgYmVoYXZpb3InKTtcbiAgICBhc3NlcnQodHlwZW9mIHN0YXJ0UGl0Y2ggPT09ICdudW1iZXInLFxuICAgICAgJ2BzdGFydFBpdGNoYCBwcm9wIGlzIHJlcXVpcmVkIGZvciBtb3VzZSByb3RhdGUgYmVoYXZpb3InKTtcblxuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuXG4gICAgY29uc3Qge3BpdGNoLCBiZWFyaW5nfSA9IHRoaXMuX2NhbGN1bGF0ZU5ld1BpdGNoQW5kQmVhcmluZyh7XG4gICAgICBwb3MsXG4gICAgICBzdGFydFBvcyxcbiAgICAgIHN0YXJ0QmVhcmluZyxcbiAgICAgIHN0YXJ0UGl0Y2hcbiAgICB9KTtcblxuICAgIGNvbnN0IHRyYW5zZm9ybSA9IGNsb25lVHJhbnNmb3JtKG1hcC50cmFuc2Zvcm0pO1xuICAgIHRyYW5zZm9ybS5iZWFyaW5nID0gYmVhcmluZztcbiAgICB0cmFuc2Zvcm0ucGl0Y2ggPSBwaXRjaDtcblxuICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KHRyYW5zZm9ybSwge1xuICAgICAgaXNEcmFnZ2luZzogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgQGF1dG9iaW5kIF9vbk1vdXNlTW92ZShvcHQpIHtcbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcbiAgICBjb25zdCBwb3MgPSBvcHQucG9zO1xuICAgIGlmICghdGhpcy5wcm9wcy5vbkhvdmVyRmVhdHVyZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZmVhdHVyZXMgPSBtYXAucXVlcnlSZW5kZXJlZEZlYXR1cmVzKFtwb3MueCwgcG9zLnldKTtcbiAgICBpZiAoIWZlYXR1cmVzLmxlbmd0aCAmJiB0aGlzLnByb3BzLmlnbm9yZUVtcHR5RmVhdHVyZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wcm9wcy5vbkhvdmVyRmVhdHVyZXMoZmVhdHVyZXMpO1xuICB9XG5cbiAgQGF1dG9iaW5kIF9vblRvdWNoRW5kKG9wdCkge1xuICAgIHRoaXMuX29uTW91c2VVcChvcHQpO1xuICB9XG5cbiAgQGF1dG9iaW5kIF9vbk1vdXNlVXAob3B0KSB7XG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG4gICAgdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQobWFwLnRyYW5zZm9ybSwge1xuICAgICAgaXNEcmFnZ2luZzogZmFsc2UsXG4gICAgICBzdGFydERyYWdMbmdMYXQ6IG51bGwsXG4gICAgICBzdGFydEJlYXJpbmc6IG51bGwsXG4gICAgICBzdGFydFBpdGNoOiBudWxsXG4gICAgfSk7XG5cbiAgICBpZiAoIXRoaXMucHJvcHMub25DbGlja0ZlYXR1cmVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcG9zID0gb3B0LnBvcztcblxuICAgIC8vIFJhZGl1cyBlbmFibGVzIHBvaW50IGZlYXR1cmVzLCBsaWtlIG1hcmtlciBzeW1ib2xzLCB0byBiZSBjbGlja2VkLlxuICAgIGNvbnN0IHNpemUgPSB0aGlzLnByb3BzLmNsaWNrUmFkaXVzO1xuICAgIGNvbnN0IGJib3ggPSBbW3Bvcy54IC0gc2l6ZSwgcG9zLnkgLSBzaXplXSwgW3Bvcy54ICsgc2l6ZSwgcG9zLnkgKyBzaXplXV07XG4gICAgY29uc3QgZmVhdHVyZXMgPSBtYXAucXVlcnlSZW5kZXJlZEZlYXR1cmVzKGJib3gpO1xuICAgIGlmICghZmVhdHVyZXMubGVuZ3RoICYmIHRoaXMucHJvcHMuaWdub3JlRW1wdHlGZWF0dXJlcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnByb3BzLm9uQ2xpY2tGZWF0dXJlcyhmZWF0dXJlcyk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uWm9vbSh7cG9zLCBzY2FsZX0pIHtcbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBjbG9uZVRyYW5zZm9ybShtYXAudHJhbnNmb3JtKTtcbiAgICBjb25zdCBhcm91bmQgPSB1bnByb2plY3RGcm9tVHJhbnNmb3JtKHRyYW5zZm9ybSwgcG9zKTtcbiAgICB0cmFuc2Zvcm0uem9vbSA9IHRyYW5zZm9ybS5zY2FsZVpvb20obWFwLnRyYW5zZm9ybS5zY2FsZSAqIHNjYWxlKTtcbiAgICB0cmFuc2Zvcm0uc2V0TG9jYXRpb25BdFBvaW50KGFyb3VuZCwgcG9zKTtcbiAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydCh0cmFuc2Zvcm0sIHtcbiAgICAgIGlzRHJhZ2dpbmc6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIEBhdXRvYmluZCBfb25ab29tRW5kKCkge1xuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KG1hcC50cmFuc2Zvcm0sIHtcbiAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2NsYXNzTmFtZSwgd2lkdGgsIGhlaWdodCwgc3R5bGV9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBtYXBTdHlsZSA9IHtcbiAgICAgIC4uLnN0eWxlLFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBjdXJzb3I6IHRoaXMuX2N1cnNvcigpXG4gICAgfTtcblxuICAgIGxldCBjb250ZW50ID0gW1xuICAgICAgPGRpdiBrZXk9XCJtYXBcIiByZWY9XCJtYXBib3hNYXBcIlxuICAgICAgICBzdHlsZT17IG1hcFN0eWxlIH0gY2xhc3NOYW1lPXsgY2xhc3NOYW1lIH0vPixcbiAgICAgIDxkaXYga2V5PVwib3ZlcmxheXNcIiBjbGFzc05hbWU9XCJvdmVybGF5c1wiXG4gICAgICAgIHN0eWxlPXsge3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiAwLCB0b3A6IDB9IH0+XG4gICAgICAgIHsgdGhpcy5wcm9wcy5jaGlsZHJlbiB9XG4gICAgICA8L2Rpdj5cbiAgICBdO1xuXG4gICAgaWYgKHRoaXMucHJvcHMub25DaGFuZ2VWaWV3cG9ydCkge1xuICAgICAgY29udGVudCA9IChcbiAgICAgICAgPE1hcEludGVyYWN0aW9uc1xuICAgICAgICAgIG9uTW91c2VEb3duID17IHRoaXMuX29uTW91c2VEb3duIH1cbiAgICAgICAgICBvbk1vdXNlRHJhZyA9eyB0aGlzLl9vbk1vdXNlRHJhZyB9XG4gICAgICAgICAgb25Nb3VzZVJvdGF0ZSA9eyB0aGlzLl9vbk1vdXNlUm90YXRlIH1cbiAgICAgICAgICBvbk1vdXNlVXAgPXsgdGhpcy5fb25Nb3VzZVVwIH1cbiAgICAgICAgICBvbk1vdXNlTW92ZSA9eyB0aGlzLl9vbk1vdXNlTW92ZSB9XG4gICAgICAgICAgb25Ub3VjaFN0YXJ0ID17IHRoaXMuX29uVG91Y2hTdGFydCB9XG4gICAgICAgICAgb25Ub3VjaERyYWcgPXsgdGhpcy5fb25Ub3VjaERyYWcgfVxuICAgICAgICAgIG9uVG91Y2hSb3RhdGUgPXsgdGhpcy5fb25Ub3VjaFJvdGF0ZSB9XG4gICAgICAgICAgb25Ub3VjaEVuZCA9eyB0aGlzLl9vblRvdWNoRW5kIH1cbiAgICAgICAgICBvblpvb20gPXsgdGhpcy5fb25ab29tIH1cbiAgICAgICAgICBvblpvb21FbmQgPXsgdGhpcy5fb25ab29tRW5kIH1cbiAgICAgICAgICB3aWR0aCA9eyB0aGlzLnByb3BzLndpZHRoIH1cbiAgICAgICAgICBoZWlnaHQgPXsgdGhpcy5wcm9wcy5oZWlnaHQgfT5cblxuICAgICAgICAgIHsgY29udGVudCB9XG5cbiAgICAgICAgPC9NYXBJbnRlcmFjdGlvbnM+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHN0eWxlPXsge1xuICAgICAgICAgIC4uLnRoaXMucHJvcHMuc3R5bGUsXG4gICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICB9IH0+XG5cbiAgICAgICAgeyBjb250ZW50IH1cblxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5NYXBHTC5wcm9wVHlwZXMgPSBQUk9QX1RZUEVTO1xuTWFwR0wuZGVmYXVsdFByb3BzID0gREVGQVVMVF9QUk9QUztcbiJdfQ==