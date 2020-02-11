# Script for converting layouts from the old format.

import os
import json
import codecs

files = [f for f in os.listdir('.') if os.path.isfile(f) and f.endswith(".layout")]
for f in files:
    with open(f, 'r') as currentFile:
        layoutData = []
        for line in currentFile:
            (key, _, val) = line.partition(' ')
            layoutData.append({
                "scancode": key.replace('\n', ''),
                "label": val.replace('\n', '')
            })
        print(layoutData)
        with open(f.replace(".layout", ".azlgl.json"), "w", encoding='utf-8') as newFile:
            json.dump(layoutData, newFile, ensure_ascii=False)