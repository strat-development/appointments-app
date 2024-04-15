export default function BusinessPage({
    params
}: {
    params: {
        slug: string
    }
}) {

    const { slug } = params;

    return (
        <div>
            <h1>Business Page</h1>
        </div>
    )
}