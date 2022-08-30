function mapObjectToUpdateQuery({ object, offset = 1 }: any) {
    const objectColumns = Object.keys(object)
        .map((key, index) => `"${key}"=$${index + offset}`)
        .join(',');
    const objectValues = Object.values(object);

    return { objectColumns, objectValues };
}

export default mapObjectToUpdateQuery;
