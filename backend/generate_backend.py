from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pg_logger
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for all origins (you can adjust this as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CodeRequest(BaseModel):
    code: str

# Set the float precision globally
json.encoder.FLOAT_REPR = lambda f: ('%.3f' % f)

def json_finalizer(input_code, output_trace):
    ret = dict(code=input_code, trace=output_trace)
    json_output = json.dumps(ret, indent=2)
    return json_output

# Define the route to execute the code
@app.post("/run_code")
async def run_code(request: CodeRequest):
    input_code = request.code
    if not input_code:
        raise HTTPException(status_code=400, detail="No code provided")

    try:
        trace_result = pg_logger.exec_script_str_local(input_code, None, False, False, json_finalizer)
        return json.loads(trace_result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.generate_backend:app", host="0.0.0.0", port=8000)
