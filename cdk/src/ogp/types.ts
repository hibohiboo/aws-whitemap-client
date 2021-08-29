
interface NullValue {
  nullValue: null
}
interface StringValue {
  stringValue: string
}

interface TimestampValue {
  mapValue: {
    fields: {
      seconds: StringValue
      nanoseconds: StringValue
    }
  }
}

export interface SceneBg {
  mapValue: {
    fields: {
      materialSiteUrl: StringValue
      updatedAt: TimestampValue
      licenseUrl: StringValue
      licenseName: StringValue
      id: StringValue
      uid: StringValue
      materialSiteName: StringValue
      url: StringValue
      name: StringValue
      tags: StringValue
    }
  }
}

export interface FireStoreScene {
  name: string,
  fields: {
    bg: SceneBg | NullValue
    title: StringValue
  }
}