from django.shortcuts import render

# Create your views here.
def fov_trainer(request):

    return render(request, 'main/fov_trainer.html')