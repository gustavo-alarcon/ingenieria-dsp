from flask import Flask

app = Flask(__name__)


@app.route('/')
def index():
    return 'Hola mundo loco!'


if __name__ == '__main__':
    app.run(debug=True, port=8000)
