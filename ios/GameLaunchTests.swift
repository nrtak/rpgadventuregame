import XCTest

final class GameLaunchTests: XCTestCase {
    func testOpeningLoadsAndJournalWorks() {
        let app = XCUIApplication()
        app.launch()
        XCUIDevice.shared.orientation = .landscapeLeft
        let journal = app.webViews.buttons["Journal"].firstMatch
        XCTAssertTrue(journal.waitForExistence(timeout: 25), "The bundled game must load and run JavaScript")
        let opening = XCTAttachment(screenshot: app.screenshot())
        opening.name = "Opening gameplay on iPhone simulator"
        opening.lifetime = .keepAlways
        add(opening)
        journal.tap()
        let close = app.webViews.buttons["Close journal"].firstMatch
        XCTAssertTrue(close.waitForExistence(timeout: 5), "Journal must respond to touch")
        close.tap()
        XCTAssertTrue(journal.exists)
    }
}
