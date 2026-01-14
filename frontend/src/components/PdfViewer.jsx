export function PdfViewer({ url }) {
    return (
        <div className="h-full w-full bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden shadow-inner">
            <iframe
                src={url}
                className="w-full h-full"
                title="PDF Viewer"
            />
        </div>
    );
}
