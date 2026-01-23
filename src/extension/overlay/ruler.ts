/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { OverlayTemplate } from '../../component/Overlay'
import { isNumber } from '../../common/utils/typeChecks'

const ruler: OverlayTemplate = {
  name: 'ruler',
  totalStep: 2,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: false,
  needDefaultYAxisFigure: false,
  styles: {
    line: {
      color: '#4285F4',
      size: 1,
      style: 'solid'
    },
    text: {
      color: '#4285F4',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal'
    }
  },
  createPointFigures: ({ chart, overlay, coordinates }) => {
    if (coordinates.length === 2) {
      const points = overlay.points
      const dataList = chart.getDataList()

      const [startPoint, endPoint] = points
      let periodCount = 0
      let changePercent = 0
      let changeValue = 0
      let startDate = ''
      let endDate = ''

      if (isNumber(startPoint.dataIndex) && isNumber(endPoint.dataIndex) &&
          startPoint.dataIndex >= 0 && endPoint.dataIndex >= 0 &&
          startPoint.dataIndex < dataList.length && endPoint.dataIndex < dataList.length) {
        const startData = dataList[startPoint.dataIndex]
        const endData = dataList[endPoint.dataIndex]

        if (startData && endData) {
          // Calculate period count (number of K-line bars)
          periodCount = Math.abs(endPoint.dataIndex - startPoint.dataIndex)

          // Calculate price change
          const startPrice = startData.close
          const endPrice = endData.close
          changeValue = endPrice - startPrice

          // Calculate percentage change
          if (startPrice !== 0) {
            changePercent = (changeValue / startPrice) * 100
          }

          // Format dates as yyyy-mm-dd
          const formatDate = (timestamp: number) => {
            const date = new Date(timestamp)
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            return `${year}-${month}-${day}`
          }
          startDate = formatDate(startData.timestamp)
          endDate = formatDate(endData.timestamp)
        }
      }

      const [startCoord, endCoord] = coordinates
      const midX = (startCoord.x + endCoord.x) / 2
      const midY = (startCoord.y + endCoord.y) / 2

      const changeText = changePercent >= 0
        ? `+${changePercent.toFixed(2)}%`
        : `${changePercent.toFixed(2)}%`

      const valuePrecision = chart.getSymbol()?.pricePrecision ?? 2
      const valueText = `${changeValue >= 0 ? '+' : ''}${changeValue.toFixed(valuePrecision)}`

      return [
        // Main line
        {
          type: 'line',
          attrs: { coordinates: [startCoord, endCoord] }
        },
        // Start point circle
        {
          type: 'circle',
          attrs: {
            x: startCoord.x,
            y: startCoord.y,
            r: 4
          },
          ignoreEvent: true
        },
        // End point circle
        {
          type: 'circle',
          attrs: {
            x: endCoord.x,
            y: endCoord.y,
            r: 4
          },
          ignoreEvent: true
        },
        // Selection area rectangle (highlights the entire selected range)
        {
          type: 'rect',
          attrs: {
            x: Math.min(startCoord.x, endCoord.x),
            y: Math.min(startCoord.y, endCoord.y),
            width: Math.abs(endCoord.x - startCoord.x),
            height: Math.abs(endCoord.y - startCoord.y)
          },
          styles: {
            style: 'fill',
            color: 'rgba(66, 133, 244, 0.2)'
          },
          ignoreEvent: true
        },
        // Selection area border
        {
          type: 'rect',
          attrs: {
            x: Math.min(startCoord.x, endCoord.x),
            y: Math.min(startCoord.y, endCoord.y),
            width: Math.abs(endCoord.x - startCoord.x),
            height: Math.abs(endCoord.y - startCoord.y)
          },
          styles: {
            style: 'stroke',
            color: 'rgba(66, 133, 244, 0.8)',
            size: 1
          },
          ignoreEvent: true
        },
        // Info text background
        {
          type: 'rect',
          attrs: {
            x: midX - 55,
            y: midY - 50,
            width: 110,
            height: 80
          },
          styles: {
            style: 'fill',
            color: 'rgba(66, 133, 244, 0.9)'
          },
          ignoreEvent: true
        },
        // Start date label
        {
          type: 'text',
          attrs: {
            x: midX,
            y: midY - 35,
            text: startDate,
            align: 'center',
            baseline: 'middle'
          },
          styles: {
            color: '#FFFFFF',
            size: 10
          },
          ignoreEvent: true
        },
        // End date label
        {
          type: 'text',
          attrs: {
            x: midX,
            y: midY - 22,
            text: endDate,
            align: 'center',
            baseline: 'middle'
          },
          styles: {
            color: '#FFFFFF',
            size: 10
          },
          ignoreEvent: true
        },
        // Period count label
        {
          type: 'text',
          attrs: {
            x: midX,
            y: midY - 8,
            text: `${periodCount} Bar${periodCount !== 1 ? 's' : ''}`,
            align: 'center',
            baseline: 'middle'
          },
          styles: {
            color: '#FFFFFF',
            size: 10
          },
          ignoreEvent: true
        },
        // Change percent label
        {
          type: 'text',
          attrs: {
            x: midX,
            y: midY + 6,
            text: changeText,
            align: 'center',
            baseline: 'middle'
          },
          styles: {
            color: '#FFFFFF',
            size: 11
          },
          ignoreEvent: true
        },
        // Change value label
        {
          type: 'text',
          attrs: {
            x: midX,
            y: midY + 22,
            text: valueText,
            align: 'center',
            baseline: 'middle'
          },
          styles: {
            color: '#FFFFFF',
            size: 11
          },
          ignoreEvent: true
        }
      ]
    }
    return []
  },
  onDrawEnd: ({ chart, overlay }) => {
    // Remove the ruler overlay after drawing is complete
    chart.removeOverlay({ id: overlay.id })
  }
}

export default ruler
