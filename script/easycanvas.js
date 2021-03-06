/**
 * @module EasyCanvas
 * @author Jonathan Kuhl <jckuhl87@gmail.com>
 * @file A library for simplifying canvas
 * @copyright Copyright 2018
 */

/**
 * @class
 * @memberof module:EasyCanvas
 */

'use strict';

module.exports = {

    distance: function(x, y, dx, dy) {
        return Math.sqrt(
            Math.pow(((dx - x), 2) + ((dy - y), 2))
        );
    },

    /**
     * Clears all contexts in width X, Y
     * @param {number} w - Width of the area being cleared
     * @param {number} l - Length of the area being cleared
     * @param {CanvasRenderingContext2D} args - The contexts being cleared
     */
    clearAll: function(w, l, ...args) {
        for (let arg of args) {
            arg.clearRect(0, 0, w, l);
        }
    },

    /**
     * Draws a borderless circle
     * @param {CanvasRenderingContext2D} context - The rendering context for the canvas
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} radius - Circle's radius
     * @param {string} color - Color value
     */
    drawCircleNoBorder: function(context, x, y, radius, color) {
        context.beginPath();
        context.arc(x, y, radius * 2, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
        context.closePath;
    },

    /**
     * Draws a borderless rectangle
     * @param {CanvasRenderingContext2D} context - The rendering context for the canvas
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} w - Width
     * @param {number} l - Length
     * @param {string} color - Color value
     */
    drawRectNoBorder: function(context, x, y, w, l, color) {
        context.beginPath();
        context.rect(x, y, w, l);
        context.fillStyle = color;
        context.fill();
        context.closePath();
    },

    /**
     * Draws text on a canvas
     * @param {CanvasRenderingContext2D} context - The rendering context for the canvas
     * @param {object} props - Text properties
     * @prop {string} string - Text to be displayed
     * @prop {number} fontsize - Font size, like 18 for 18pt
     * @prop {string} face - Font face
     * @prop {string} [color="black"] - Text color, defaults to black
     * @prop {string} [just="center"] - Justification, defaults to left
     * @prop {number} x - X position
     * @prop {number} y - Y position
     */
    drawText: function(context, props = {
        string: string,
        fontsize: fontsize,
        face: face,
        color: black,
        just: "left",
        x: x,
        y: y
    }) {
        context.font = this.setFont(props.fontsize, props.face);
        context.fillStyle = props.color;
        context.textAlign = props.just;
        context.fillText(props.string, props.x, props.y);
    },

    /**
     * Draws a line
     * @param {CanvasRenderingContext2D} context - The rendering context for the canvas
     * @param {object} props - Line properties
     * @prop {number} x - start X position
     * @prop {number} y - start Y position
     * @prop {number} dx - end X position
     * @prop {number} dy - end Y position
     * @prop {number} lineWidth - Line width, defaults to 1
     * @prop {string} color - Line color, defaults to black
     */
    drawLine: function(context, props = {
        x: x,
        y: y,
        dx: dx,
        dy: dy,
        lineWidth: 1,
        color: "black"
    }) {
        context.beginPath();
        context.moveTo(props.x, props.y);
        context.lineTo(props.dx, props.dy);
        context.lineWidth = props.lineWidth;
        context.strokeStyle = props.color;
        context.stroke();
    },

    /**
     * Draws a polygon of x sides
     * @param {CanvasRenderingContext2D} context - The rendering context for the canvas
     * @param {array} vertexMatrix - Array of objects with properties x and y
     * @prop {string} color - Line color, defaults to black
     */
    drawPolygon: function(context, vertexMatrix) {
        context.beginPath();
        for (let i = 0; i < vertexMatrix.length; i++) {
            context.moveTo(vertexMatrix[i].x, vertexMatrix[i].y);
            if (i + 1 < vertexMatrix) {
                context.lineTo(vertexMatrix[i + k].x, vertexMatrix[i + k].y);
            } else {
                context.lineTo(vertexMatrix[0].x, vertexMatrix[0].y);
            }
        }
    },

    /**
     * Sets a font
     * @param {number} fontsize - Font size, like 18 for 18pt
     * @param {string} face - Font face
     * @return {string} - A font face string
     */
    setFont: function(fontsize, face) {
        return `normal ${fontsize}pt ${face}`;
    },

    /**
     * Gets the center of the canvas
     * @param {element} canvas - Canvas element
     * @return {object} - Returns an object with the x and y values of the center
     */
    getCenter: function(canvas) {
        return {
            x: canvas.width / 2,
            y: canvas.height / 2
        }
    },

    /**
     * Gets the corners of the canvas
     * @param {element} canvas - Canvas element
     * @return {object} - Returns an object with the top, bottom, left, right corner values
     */
    getCornerPositions: function(canvas) {
        return {
            top: canvas.getBoundingClientRect().top,
            bottom: canvas.getBoundingClientRect().bottom,
            left: canvas.getBoundingClientRect().left,
            right: canvas.getBoundingClientRect().right
        };
    },
}