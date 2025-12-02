// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterLilypond",
    products: [
        .library(name: "TreeSitterLilypond", targets: ["TreeSitterLilypond"]),
    ],
    dependencies: [
        .package(name: "SwiftTreeSitter", url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.9.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterLilypond",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterLilypondTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterLilypond",
            ],
            path: "bindings/swift/TreeSitterLilypondTests"
        )
    ],
    cLanguageStandard: .c11
)
