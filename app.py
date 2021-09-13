from flask import Flask, render_template,url_for #追加
import os
app = Flask(__name__)

@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)

def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path,
                                     endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)


@app.route('/')
def main():
    name = "Hoge"
    return render_template('index.html', title='flask test', name=name) #変更


## おまじない
if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0')