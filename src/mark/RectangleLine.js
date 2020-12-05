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

import TwoPointLineGraphicMark from './TwoPointLineGraphicMark'
import { HoverType } from './GraphicMark'

export default class RectangleLine extends TwoPointLineGraphicMark {
    _checkMousePointOnLine (point, xyPoints) {
        const lines = this._generatedDrawLines(xyPoints)
        for (let i = 0; i < lines.length; i++) {
          const points = lines[i]
          if (checkPointOnStraightLine(points[0], points[1], point)) {
            return {
              hoverType: HoverType.LINE,
              hoverIndex: i
            }
          }
        }
      }
    
    _generatedDrawLines (xyPoints) {
    const lines = []
    if (xyPoints.length > 0) {
        const p1 = {x : xyPoints[0].x , y: xyPoints[0].y}
        const p2 = {x : xyPoints[1].x , y: xyPoints[0].y}
        const p3 = {x : xyPoints[1].x , y: xyPoints[1].y}
        const p4 = {x : xyPoints[0].x , y: xyPoints[1].y}
        lines.push([p1,p2])
        lines.push([p2,p3])
        lines.push([p3,p4])
        lines.push([p4,p1])
    }
    return lines
    }
}
