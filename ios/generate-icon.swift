import AppKit
import Foundation
let root = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
try FileManager.default.createDirectory(at: root, withIntermediateDirectories: true)
let image = NSImage(size: NSSize(width: 1024, height: 1024))
image.lockFocus()
NSColor(calibratedRed: 0.05, green: 0.34, blue: 0.48, alpha: 1).setFill()
NSBezierPath(rect: NSRect(x: 0, y: 0, width: 1024, height: 1024)).fill()
NSColor(calibratedRed: 1, green: 0.81, blue: 0.36, alpha: 1).setStroke()
let ring = NSBezierPath(ovalIn: NSRect(x: 176, y: 176, width: 672, height: 672))
ring.lineWidth = 35
ring.stroke()
for i in 0..<8 {
    let a = Double(i) * Double.pi / 4
    let length = i % 2 == 0 ? 285.0 : 195.0
    let p = NSBezierPath()
    p.move(to: NSPoint(x: 512 + cos(a) * length, y: 512 + sin(a) * length))
    p.line(to: NSPoint(x: 512 + cos(a + .pi / 2) * 65, y: 512 + sin(a + .pi / 2) * 65))
    p.line(to: NSPoint(x: 512 + cos(a - .pi / 2) * 65, y: 512 + sin(a - .pi / 2) * 65))
    p.close()
    (i % 2 == 0 ? NSColor(calibratedRed: 1, green: 0.85, blue: 0.48, alpha: 1) : NSColor.white).setFill()
    p.fill()
}
image.unlockFocus()
let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: 1024, pixelsHigh: 1024, bitsPerSample: 8, samplesPerPixel: 3, hasAlpha: false, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
image.draw(in: NSRect(x: 0, y: 0, width: 1024, height: 1024))
NSGraphicsContext.restoreGraphicsState()
try rep.representation(using: .png, properties: [:])!.write(to: root.appendingPathComponent("AppIcon.png"))
let contents = """
{"images":[{"filename":"AppIcon.png","idiom":"universal","platform":"ios","size":"1024x1024"}],"info":{"author":"xcode","version":1}}
"""
try contents.write(to: root.appendingPathComponent("Contents.json"), atomically: true, encoding: .utf8)
